package com.bp.auction.server.service;

import com.bp.auction.common.constants.RedisCacheKey;
import com.bp.auction.common.dal.entity.BeginnerAuction;
import com.bp.auction.common.dal.entity.BeginnerGoods;
import com.bp.auction.server.dal.mapper.BeginnerAuctionMapper;
import com.bp.core.base.BaseServiceImpl;
import com.bp.core.cache.CacheKey;
import com.bp.core.utils.type.BigDecimalUtil;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Date;

/**
 * <p>
 * 新手引导专用拍卖 服务实现类
 * </p>
 *
 * @author zc
 * @since 2019-02-18
 */
@Service
public class BeginnerAuctionService extends BaseServiceImpl<BeginnerAuctionMapper, BeginnerAuction> {
    @Override
    protected void clearCache(BeginnerAuction entity) {
        if (entity != null && entity.getUserId() != null) {
            clearCache(entity.getUserId());
        }
    }

    private void clearCache(long userId) {
        redisTemplate.delete(RedisCacheKey.BEGINNER_AUCTION.key(userId));
    }

    /**
     * 获取某个用户的新手拍卖记录
     * @param userId 用户id
     * @return
     */
    public BeginnerAuction getByUserId(long userId) {
        return cache(RedisCacheKey.BEGINNER_AUCTION.key(userId), () -> baseMapper.getByUserId(userId));
    }

    /**
     * 插入一条新手拍卖记录
     * @param userId 用户id
     * @param bg 新手商品
     */
    public BeginnerAuction insertBeginnerAuction(long userId, BeginnerGoods bg) {
        Date now = new Date();
        BeginnerAuction ba = new BeginnerAuction();

        //用户总共出价两次(第一次免费出价+机器人出价后的再次出价)
        ba.setAuctionTimes(2);
        ba.setDefaultGoodsImage(bg.getDefaultImage());
        //当前时间设为成交时间
        ba.setEndTime(now);
        ba.setGoodsId(bg.getId());
        ba.setGoodsName(bg.getName());
        ba.setMarketPrice(bg.getMarketPrice());
        ba.setStartPrice(bg.getStartPrice());
        ba.setUserId(userId);

        //新手拍卖成交价=商品起拍价+用户第一次出价+机器人出价+用户第二次出价=商品起拍价+手续费抬价*3
        BigDecimal price = BigDecimalUtil.mul(bg.getAuctionFeePrice(), new BigDecimal(3.0D));
        price = BigDecimalUtil.add(price, bg.getStartPrice());
        ba.setPrice(price);
        ba.setCreateTime(now);

        save(ba);
        clearCache(userId);
        return ba;
    }

    /**
     * 新用户出价锁,防止恶意并发
     * @param userId 用户id
     * @return true-锁成功,false-锁失败
     */
    public boolean lock(long userId) {
        return redisTemplate.opsForValue().setIfAbsent(RedisCacheKey.BEGINNER_AUCTION_LOCK.key(userId), CacheKey.MINUTE_1);
    }

    /**
     * 新用户出价解锁
     * @param userId 用户id
     */
    public void unlock(long userId) {
        redisTemplate.delete(RedisCacheKey.BEGINNER_AUCTION_LOCK.key(userId));
    }
}
