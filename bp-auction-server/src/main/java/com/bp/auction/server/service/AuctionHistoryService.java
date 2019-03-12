package com.bp.auction.server.service;

import com.bp.auction.common.constants.AuctionStatus;
import com.bp.auction.common.constants.OperateType;
import com.bp.auction.common.constants.RedisCacheKey;
import com.bp.auction.common.dal.entity.AuctionHistory;
import com.bp.auction.server.dal.mapper.AuctionHistoryMapper;
import com.bp.auction.server.service.bo.AuctionInfo;
import com.bp.core.base.BaseServiceImpl;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Collection;
import java.util.Collections;
import java.util.Set;

/**
 * <p>
 * 拍卖记录表 服务实现类
 * </p>
 *
 * @author zc
 * @since 2019-02-18
 */
@Service
@Slf4j
public class AuctionHistoryService extends BaseServiceImpl<AuctionHistoryMapper, AuctionHistory> {

    @Autowired
    private ConfigService configService;

    @Autowired
    @Lazy
    private AuctionUserService auctionUserService;

    @Autowired
    @Lazy
    private AuctionService auctionService;

    /**
     * 生成新的主键
     *
     * @return
     */
    public long nextId() {
        return nextId(AuctionHistory.class);
    }

    /**
     * 获取某一期的拍卖记录
     *
     * @param auctionId 拍卖id
     * @return
     */
    public Collection<AuctionHistory> getByAuctionId(long auctionId) {
        AuctionInfo auctionInfo = auctionService.getAuctionInfoById(auctionId);
        if (auctionInfo == null) {
            return Collections.emptyList();
        }

        AuctionStatus status = auctionInfo.getAuctionStatus();
        //如果不存在或者未开始或者流拍返回空集合
        if (status == AuctionStatus.NO_AUCTION || status == AuctionStatus.FAILED) {
            return Collections.emptyList();
        }

        int max = configService.getMaxAuctionHistoryNum();
        //成交的从数据库查询并放入redis
        if (status == AuctionStatus.SUCCESS) {
            return cache(RedisCacheKey.AUCTION_HISTORY_SUCCESS.key(auctionId), () -> baseMapper.getByAuctionId(auctionId, max));
        }
        //进行中的拍卖则从redis有序set中取拍卖出价记录
        long auctionTimes = auctionInfo.getAuctionTimes();
        Set<AuctionHistory> set = redisTemplate.boundZSetOps(RedisCacheKey.AUCTION_HISTORY_AUCTIONING.key(auctionId))
                .reverseRangeByScore(auctionTimes - max, auctionTimes);
        return set;
    }

    /**
     * 异步保存拍卖记录,后台定时任务会从队列中取出记录并保存入数据库
     * @param id 主键
     * @param userId 用户id
     * @param nickname 用户昵称
     * @param headImg 用户头像
     * @param vipLevel 用户贵族等级
     * @param auctionId 拍卖id
     * @param fee 手续费
     * @param operateType 操作类型
     * @param afterPrice 当前价格
     * @param createTime 创建时间
     * @param count 该场拍卖的累计出价次数
     */
    @Async
    public void asyncSave(long id, long userId, String nickname, String headImg, Integer vipLevel, long auctionId,
                          long fee, OperateType operateType,BigDecimal afterPrice, long createTime, long count) {
        AuctionHistory ah = new AuctionHistory(id, auctionId, userId, nickname, headImg, vipLevel, fee,
                new BigDecimal(0.0D), afterPrice, operateType.getValue(), createTime);
        redisTemplate.boundZSetOps(RedisCacheKey.AUCTION_HISTORY_AUCTIONING.key(auctionId)).add(ah, count);
        baseMapper.insert(ah);
        //更新我的竞拍
        auctionUserService.updateAuctionUser(ah.getUserId(), ah.getAuctionId(), ah.getAuctionFee(), ah.getCreateTime());
    }

    /**
     * 异步保存拍卖记录,后台定时任务会从队列中取出记录并保存入数据库
     * @param id 主键
     * @param userId 用户id
     * @param nickname 用户昵称
     * @param headImg 用户头像
     * @param vipLevel 用户贵族等级
     * @param auctionId 拍卖id
     * @param fee 手续费
     * @param operateType 操作类型
     * @param createTime 创建时间
     */
    @Async
    public void asyncSave(long id, long userId, String nickname, String headImg, Integer vipLevel, long auctionId,
                          long fee, OperateType operateType, long createTime) {
        BigDecimal bd = new BigDecimal(0);
        AuctionHistory ah = new AuctionHistory(id, auctionId, userId, nickname, headImg, vipLevel, fee,
                bd, bd, operateType.getValue(), createTime);
        save(ah);
        //更新我的竞拍
        auctionUserService.updateAuctionUser(ah.getUserId(), ah.getAuctionId(), ah.getAuctionFee(), ah.getCreateTime());
    }
}
