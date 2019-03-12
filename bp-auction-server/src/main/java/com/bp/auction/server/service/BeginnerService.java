package com.bp.auction.server.service;

import com.bp.auction.common.constants.RedisCacheKey;
import com.bp.auction.common.dal.entity.Beginner;
import com.bp.auction.server.dal.mapper.BeginnerMapper;
import com.bp.core.base.BaseServiceImpl;
import com.bp.core.cache.CacheKey;
import com.bp.core.utils.type.DateUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;

/**
 * <p>
 * 新手表 服务实现类
 * </p>
 *
 * @author zc
 * @since 2019-02-18
 */
@Service
public class BeginnerService extends BaseServiceImpl<BeginnerMapper, Beginner> {

    @Autowired
    private ConfigService configService;

    @Override
    protected void clearCache(Beginner entity) {
        if (entity != null && entity.getUserId() != null) {
            clearCache(entity.getUserId());
        }
    }

    private void clearCache(long userId) {
        redisTemplate.delete(RedisCacheKey.BEGINNER.key(userId));
    }

    /**
     * 获取某个用户的新手信息
     *
     * @param userId 用户id
     * @return
     */
    public Beginner getByUserId(long userId) {
        return cache(RedisCacheKey.BEGINNER.key(userId), () -> baseMapper.getByUserId(userId), CacheKey.DAY_1);
    }

    /**
     * 初始化用户新手信息
     *
     * @param userId 用户id
     */
    public void initBeginner(long userId) {
        Beginner beginner = getByUserId(userId);
        if (beginner == null) {
            beginner = new Beginner();
            beginner.setUserId(userId);
            beginner.setTotalAuctionSuccessTimes(0);
            save(beginner);
        }
    }

    /**
     * 判断指定的用户是否是新小户
     *
     * @param beginner 新手信息
     * @return true-是，false-否
     */
    public boolean isBeginner(Beginner beginner) {
        if (beginner == null || beginner.getLastAuctionSuccessDate() == null) {
            return true;
        }
        int days = configService.getBeginnerJudgeDays();
        if (days <= 0) {
            days = 30;//默认往前推30天
        }
        java.sql.Date date = new java.sql.Date(System.currentTimeMillis());

        Date day = DateUtils.addDays(date, -days);
        return beginner.getLastAuctionSuccessDate().before(day);
    }

    /**
     * 判断用户是否是首次出价
     *
     * @param beginner 新手信息
     * @return true-是,false-否
     */
    public boolean isFirstAuction(Beginner beginner) {
        return beginner == null || beginner.getFirstAuctionTime() == null;
    }

    /**
     * 更新用户首次出价时间
     *
     * @param beginner    新手信息
     * @param auctionTime 用户出价时间
     */

    public void updateFirstAuctionTime(Beginner beginner, long auctionTime) {
        if (beginner != null && beginner.getFirstAuctionTime() == null) {
            baseMapper.updateFirstAuctionTime(beginner.getUserId(), new Date(auctionTime));
            clearCache(beginner.getUserId());
        }
    }

    /**
     * 更新用户拍中次数最后拍中时间等信息
     *
     * @param userId             用户id
     * @param auctionSuccessTime 拍中时间
     */
    public void auctionSuccess(long userId, Date auctionSuccessTime) {
        baseMapper.auctionSuccess(userId, auctionSuccessTime);
        clearCache(userId);
    }
}
