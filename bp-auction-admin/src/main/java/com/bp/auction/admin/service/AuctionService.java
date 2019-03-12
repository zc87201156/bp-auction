package com.bp.auction.admin.service;


import com.bp.auction.admin.dal.mapper.AuctionMapper;
import com.bp.auction.common.constants.AuctionClass;
import com.bp.auction.common.constants.RedisCacheKey;
import com.bp.auction.common.constants.Status;
import com.bp.auction.common.dal.entity.Auction;
import com.bp.auction.common.queue.message.DelayMessage;
import com.bp.auction.common.queue.message.DelayMessageType;
import com.bp.auction.common.service.DelayMessageService;
import com.bp.auction.common.util.SysUtil;
import com.bp.core.base.BaseServiceImpl;
import com.bp.core.cache.CacheKey;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 * 类名称：AuctionService
 * 类描述：
 * 开发人：朱水平【Tank】
 * 创建时间：2019/1/15.15:05
 * 修改备注：
 *
 * @author Tank
 * @version 1.0.0
 */
@Slf4j
@Service
public class AuctionService extends BaseServiceImpl<AuctionMapper, Auction> {

    @Autowired
    private DelayMessageService delayMessageService;
    @Autowired
    private DepositService depositService;
    @Autowired
    private StringRedisTemplate stringRedisTemplate;

    @Override
    protected void clearCache(Auction entity) {
        if (entity != null && entity.getId() != null) {
            redisTemplate.delete(RedisCacheKey.AUCTION_INFO_BY_ID.key(entity.getId()));
            redisTemplate.delete(RedisCacheKey.GOODS_AUCTION_NEXT.key(entity.getEnvironment(), entity.getGoodsId()));
        }
    }

    /**
     * 启用拍卖
     *
     * @param auction 拍卖
     * @return true-开启成功，false-开启失败
     */
    public boolean enableAuction(Auction auction) {
        //设置已启用状态
        auction.setEnable(Status.ENABLE.getValue());
        save(auction);
        //构造拍卖开始延迟消息
        DelayMessage message = new DelayMessage(DelayMessageType.START_AUCTION, auction.getId());
        //向rabbitMQ延迟队列中发送消息
        boolean success = delayMessageService.send(message, auction.getStartTime());
        if (success) {
            //刷新大厅id列表缓存
            reloadIdListCacheInHall(auction.getAuctionClass());
        } else {
            //如果发送延迟消息失败，则将拍卖记录状态置为禁用状态
            auction.setEnable(Status.DISABLE.getValue());
            save(auction);
            log.error("start auction failed. delayMessage:[{}]", message);
        }
        return success;
    }

    /**
     * 取消拍卖
     *
     * @param auctionId 拍卖id
     */
    public void disableAuction(long auctionId) {
        //消息累计数加1,为了让原来的延迟消息失效
        delayMessageService.incrMessageCount(new DelayMessage(DelayMessageType.START_AUCTION, auctionId));
        //刷新大厅id列表缓存
        Auction auction = getById(auctionId);
        if (auction != null) {
            reloadIdListCacheInHall(auction.getAuctionClass());
        }
    }

    /**
     * 刷新大厅id列表缓存
     *
     * @param auctionClass
     */
    private void reloadIdListCacheInHall(Integer auctionClass) {
        if (auctionClass != null) {
            redisTemplate.delete(RedisCacheKey.AUCTION_HALL_ID_LIST.key(auctionClass));
            findIdListInHall(auctionClass);
        }
    }

    /**
     * 获取大厅某场次类型的id列表
     *
     * @param auctionClass 场次类型
     * @return
     */
    private List<Long> findIdListInHall(Integer auctionClass) {
        return cache(RedisCacheKey.AUCTION_HALL_ID_LIST.key(auctionClass),
                () -> baseMapper.findIdListInHall(SysUtil.getEnvironment().getValue(), auctionClass),
                CacheKey.DAY_1);
    }

    /***
     * 获取所有未开始的有效拍卖信息
     * @param rollAuctionId 如果 rollAuctionId不为空，获取某滚拍场次下的有效Id
     * @return
     */
    public List<Auction> getNoStartAuctions(Long rollAuctionId) {
        return baseMapper.getNoStartAuctions(rollAuctionId);
    }

    /***
     * 禁用未开始的期次
     * @param rollAuctionId
     */
    public void disableNoStartAuctions(Long rollAuctionId) {
        List<Auction> list = getNoStartAuctions(rollAuctionId);
        if (!CollectionUtils.isEmpty(list)) {
            //需要刷新大厅列表的场次类型
            Set<AuctionClass> auctionClasses = new HashSet<>();
            //再将拍卖记录置为禁用状态
            for (Auction ac : list) {
                ac.setEnable(Status.DISABLE.getValue());
                save(ac);
                //同时清除场次下面所有用户托管的记录
                depositService.delAllUserDepositRecord(ac.getId());
                AuctionClass auctionClass = AuctionClass.getByValue(ac.getAuctionClass());
                auctionClasses.add(auctionClass);
            }
            //刷新各场次类型的大厅缓存列表
            for (AuctionClass ac : auctionClasses) {
                reloadIdListCacheInHall(ac.getValue());
            }
        }
    }

}
