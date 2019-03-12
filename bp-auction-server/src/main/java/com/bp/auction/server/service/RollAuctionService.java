package com.bp.auction.server.service;

import com.bp.auction.common.constants.*;
import com.bp.auction.common.dal.entity.Auction;
import com.bp.auction.common.dal.entity.CategoryGoods;
import com.bp.auction.common.dal.entity.Goods;
import com.bp.auction.common.dal.entity.RollAuction;
import com.bp.auction.common.util.SysUtil;
import com.bp.auction.server.dal.mapper.RollAuctionMapper;
import com.bp.auction.server.service.bo.AuctionInfo;
import com.bp.core.base.BaseServiceImpl;
import com.bp.core.utils.type.DateUtils;
import com.bp.core.utils.type.TimeUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import java.sql.Time;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * <p>
 * 服务实现类
 * </p>
 *
 * @author zc
 * @since 2019-02-18
 */
@Service
@Slf4j
public class RollAuctionService extends BaseServiceImpl<RollAuctionMapper, RollAuction> {
    @Autowired
    private AuctionService auctionService;
    @Autowired
    private CategoryGoodsService categoryGoodsService;
    @Autowired
    private GoodsService goodsService;

    @Override
    protected void clearCache(RollAuction entity) {
        redisTemplate.delete(RedisCacheKey.ROLL_AUCTION_LIST.key());
    }

    /**
     * 获取所有已启用且未终止的滚拍配置
     *
     * @return
     */
    public List<RollAuction> listRollAuctions() {
        return cache(RedisCacheKey.ROLL_AUCTION_LIST.key(), () -> baseMapper.listRollAuctions(SysUtil.getEnvironment().getValue()));
    }

    /**
     * 获取指定滚拍类型的滚拍
     *
     * @param type 滚拍类型
     * @return
     */
    public List<RollAuction> findByType(RollAuctionType type) {
        List<RollAuction> result = new ArrayList<>();
        for (RollAuction ra : listRollAuctions()) {
            if (ra.getType() != null && ra.getType() == type.getValue()) {
                result.add(ra);
            }
        }
        return result;
    }

    /**
     * 处理滚拍
     *
     * @param rollAuction 滚拍信息
     * @return
     */
    public Long dealRollAuction(RollAuction rollAuction) {
        //滚拍不存在或已被禁用,不再生成新的
        if (rollAuction == null||rollAuction.getEnable()==Status.DISABLE.getValue()) {
            return null;
        }
        //如果当前那期拍卖还未完成，不能生成新的拍卖,且默认调下更新拍卖场次的任务
        AuctionInfo auctionInfo = auctionService.getAuctionInfoById(rollAuction.getCurrentAuctionId());
        if (auctionInfo != null
                && (auctionInfo.getAuctionStatus() == AuctionStatus.NO_AUCTION
                || auctionInfo.getAuctionStatus() == AuctionStatus.AUCTIONING)) {
            return auctionInfo.getId();
        }
        //默认下一期开始时间为当前服务器时间加上时间间隔
        Date start = DateUtils.addSeconds(new Date(), rollAuction.getPeriod());
        Time sTime = Time.valueOf(DateUtils.formatDate(start, "HH:mm:ss"));
        //判断时间是否在范围内
        if (!TimeUtils.judgeInPeriod(Time.valueOf(DateUtils.formatDate(rollAuction.getStartTime(), "HH:mm:ss")), Time.valueOf(DateUtils.formatDate(rollAuction.getEndTime(), "HH:mm:ss")), sTime)) {
            //判断当前时间是否已经超过设置的开始时间点,如果未超过，按当天算；如果超过了，按次日算
            if (sTime.before(rollAuction.getStartTime())) {
                start = DateUtils.parseDateTime(DateUtils.formatDate(start) + " " + rollAuction.getStartTime().toString());
            } else {
                start = DateUtils.parseDateTime(DateUtils.formatDate(DateUtils.getNextDate(start)) + " " + rollAuction.getStartTime().toString());
            }
        }
        List<CategoryGoods> list = categoryGoodsService.listGoods(rollAuction.getCategoryId());
        if (CollectionUtils.isEmpty(list)) {
            log.warn("dealRollAuction [{}] fail.No available goods.", rollAuction.getId());
            return null;
        }
        Long goodsId;
        int currTurn = rollAuction.getCurrentTurn();
        //说明是第一次生成
        if (rollAuction.getCurrentAuctionId() == null && rollAuction.getCurrentGoodsId() == null) {
            //取场次配置的第一个商品
            goodsId = list.get(0).getGoodsId();
            currTurn = 1;
        } else {
            CategoryGoods categoryGoods = new CategoryGoods();
            categoryGoods.setGoodsId(rollAuction.getCurrentGoodsId());
            int idx = list.indexOf(categoryGoods);
            //判断商品是否是最后一个商品
            if (idx == list.size() - 1) {
                currTurn = currTurn + 1;
                goodsId = list.get(0).getGoodsId();
            } else {
                goodsId = list.get(idx + 1).getGoodsId();
            }
            if (goodsId == null) {
                log.warn("dealRollAuction [{}] fail.No available.", rollAuction.getId());
                return null;
            }
            //如果该滚拍场次有轮数限制，且轮数已经达到上限，则不再产生新的期次
            if (rollAuction.getTurns() > 0) {
                if (currTurn > rollAuction.getTurns()) {
                    log.warn("dealRollAuction [{}] fail.Turns over limit.turnsLimit [{}]", rollAuction.getId(), rollAuction.getTurns());
                    rollAuction.setStatus(RollAuctionStatus.ENDED.getValue());//滚拍状态更新为已结束
                    save(rollAuction);
                    return null;
                }
            }
        }
        Goods goods = goodsService.get(goodsId);
        if (goods == null) {
            log.warn("deal roll auction [{}] failed. goodsId[{}] not exists.", rollAuction.getId(), goodsId);
            return null;
        }

        //生成一条拍卖记录(默认启用)
        Auction auction = new Auction();
        auction.setAuctionStatus(AuctionStatus.NO_AUCTION.getValue());
        auction.setStartTime(start);
        auction.setGoodsId(goodsId);
        auction.setType(AuctionType.ROLL.getValue());
        auction.setEnable(Status.ENABLE.getValue());
        auction.setRollAuctionId(rollAuction.getId());
        //滚拍类型填入拍卖的场次类型字段中
        auction.setAuctionClass(rollAuction.getType());
        auction.setSort(rollAuction.getSort());
        auction.setPaymentStatus(PaymentStatus.UNPAID.getValue());
        auction.setCurrentPrice(goods.getStartPrice());
        auction.setOperator(rollAuction.getOperator());
        auction.setEnvironment(rollAuction.getEnvironment());
        auction.setCanDeposit(rollAuction.getCanDeposit());
        auction.setFreeEntryFee(rollAuction.getFreeEntryFee());
        auction.setFreeRaisePrice(rollAuction.getFreeRaisePrice());
        auctionService.save(auction);
        //将当期拍卖期次ID更新到滚拍信息里去
        rollAuction.setCurrentAuctionId(auction.getId());
        rollAuction.setCurrentGoodsId(goodsId);
        rollAuction.setCurrentTurn(currTurn);
        save(rollAuction);
        //发送启用该拍卖的延时任务消息
        auctionService.enableAuction(auction);
        return auction.getId();
    }

}
