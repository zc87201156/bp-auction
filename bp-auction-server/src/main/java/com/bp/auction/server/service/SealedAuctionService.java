package com.bp.auction.server.service;


import com.bp.auction.common.constants.Attribute;
import com.bp.auction.common.constants.AuctionStatus;
import com.bp.auction.common.constants.RedisCacheKey;
import com.bp.auction.common.dal.entity.SealedAuctionRanking;
import com.bp.auction.server.service.bo.SealedAuctionInfo;
import com.bp.auction.server.service.bo.SealedAuctionRankingInfo;
import com.bp.core.cache.CacheKey;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.BoundHashOperations;
import org.springframework.data.redis.core.BoundZSetOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.*;
import java.util.concurrent.TimeUnit;

/**
 * 暗拍服务
 *
 * @author zwf
 */
@Service
public class SealedAuctionService {
    @Autowired
    private RedisTemplate redisTemplate;

    private static final String BLANK = "";

    @Autowired
    private AuctionAttributeService auctionAttributeService;

    @Autowired
    private SealedAuctionRankingService sealedAuctionRankingService;

    /**
     * 判断用户是否在指定的暗拍场出价
     *
     * @param auctionId 拍卖id
     * @param userId    用户id
     * @return true-已出价,false-未出价
     */
    public boolean isAuction(long auctionId, long userId) {
        return redisTemplate.opsForHash().hasKey(RedisCacheKey.SEALED_AUCTION_INFO.key(auctionId), userId + BLANK);
    }

    /**
     * 获取某个用户某场拍卖的出价信息
     *
     * @param auctionId 拍卖id
     * @param userId    用户id
     * @return
     */
    public SealedAuctionInfo getSealedAuctionInfo(long auctionId, long userId) {
        List<SealedAuctionInfo> list = redisTemplate.boundHashOps(RedisCacheKey.SEALED_AUCTION_INFO.key(auctionId)).multiGet(Arrays.asList(userId + BLANK));
        if (list == null) {
            return null;
        }
        return list.isEmpty() ? null : list.get(0);
    }

    /**
     * 获取暗拍场已出价的人数
     *
     * @param auctionId 拍卖id
     * @return
     */
    public int getAuctionedUserCount(long auctionId, AuctionStatus status) {
        if (status == AuctionStatus.NO_AUCTION || status == AuctionStatus.AUCTIONING) {
            Long num = redisTemplate.boundHashOps(RedisCacheKey.SEALED_AUCTION_INFO.key(auctionId)).size();
            return num == null ? 0 : num.intValue();
        }
        //如果拍卖已结束则从数据库中获取出价人数
        Integer num = auctionAttributeService.getAttributeValueFromDB(auctionId, Attribute.AUCTION_USER_COUNT);
        return num == null ? 0 : num;
    }

    /**
     * 用户进入指定的暗拍场
     *
     * @param auctionId 拍卖id
     * @param userId    用户id
     */
    public void enter(long auctionId, long userId) {
        //每次用户进入暗拍场就更新查询该用户离开期间出价人数的起始时间，用于统计用户离开期间的出价人数
        setQuerySealedAuctionedUserCountTime(auctionId, userId, System.currentTimeMillis());
    }

    /**
     * 用户离开指定的暗拍场
     *
     * @param auctionId 拍卖id
     * @param userId    用户id
     */
    public void left(long auctionId, long userId) {
        //用户离开暗拍场就更新查询该用户离开期间出价人数的起始时间，是为了排除用户在详情页时间段内其他用户的出价记录
        setQuerySealedAuctionedUserCountTime(auctionId, userId, System.currentTimeMillis());
    }

    /**
     * 获取用户离开期间出价的人数
     *
     * @param auctionId 拍卖id
     * @param userId    用户id
     * @return
     */
    public int getLatestAuctionedUserCount(long auctionId, long userId) {
        Object startTime = redisTemplate.boundValueOps(RedisCacheKey.QUERY_SEALED_AUCTIONED_USER_COUNT_TIME.key(auctionId, userId)).get();
        //如果查询的起始时间不存在则获取有序集合中的所有成员数量，即所有出价人数
        if (startTime == null) {
            Long num = redisTemplate.boundZSetOps(RedisCacheKey.SEALED_USER_AUCTION_TIME.key(auctionId)).size();
            //Long num = cacheHander.zcard(RedisCacheKey.SEALED_USER_AUCTION_TIME.key(auctionId));
            return num == null ? 0 : num.intValue();
        }
        //查询有序集合中指定时间戳到当前时间戳范围内的成员数量，即用户离开期间的出价人数
        Long num = redisTemplate.boundZSetOps(RedisCacheKey.SEALED_USER_AUCTION_TIME.key(auctionId)).count(Long.valueOf(String.valueOf(startTime)), System.currentTimeMillis());
        return num == null ? 0 : num.intValue();
    }

    /**
     * 用户在暗拍场出价
     *
     * @param auctionId 拍卖id
     * @param userId    用户id
     */
    public void auction(long auctionId, long userId, String nickname, String headImg, Integer vipLevel, long price) {
        SealedAuctionInfo sai = new SealedAuctionInfo(userId, nickname, headImg, vipLevel, new BigDecimal(price));
        //更新用户的出价信息
        BoundHashOperations boundHashOperations = redisTemplate.boundHashOps(RedisCacheKey.SEALED_AUCTION_INFO.key(auctionId));
        boundHashOperations.put(userId + BLANK, sai);
        boundHashOperations.expire(CacheKey.DAY_1, TimeUnit.SECONDS);
        long current = System.currentTimeMillis();
        //向有序集合中添加或更新用户的出价时间，成员分数为用户出价时间戳
        BoundZSetOperations boundZSetOperations = redisTemplate.boundZSetOps(RedisCacheKey.SEALED_USER_AUCTION_TIME.key(auctionId));
        boundZSetOperations.add(userId + BLANK, current);
        boundZSetOperations.expire(CacheKey.DAY_1, TimeUnit.SECONDS);
        //查询用户离开期间出价人数的起始时间+1毫秒,是为了下次查询时排除掉用户自己出价的这条记录(不考虑其他用户同时和自己出价的极端情况)
        long startTime = current + 1;
        //用户出价时更新该起始时间，用于统计用户离开期间的出价人数
        setQuerySealedAuctionedUserCountTime(auctionId, userId, startTime);
    }

    /**
     * 设置该时间是为了查询用户离开期间的出价人数
     *
     * @param auctionId 拍卖id
     * @param userId    用户id
     * @param startTime 起始时间
     */
    private void setQuerySealedAuctionedUserCountTime(long auctionId, long userId, long startTime) {
        redisTemplate.boundValueOps(RedisCacheKey.QUERY_SEALED_AUCTIONED_USER_COUNT_TIME.key(auctionId, userId)).set(startTime, CacheKey.DAY_1, TimeUnit.SECONDS);
    }

    /**
     * 用户出价锁
     *
     * @param userId 用户id
     * @return
     */
    public boolean lock(long userId) {
        Boolean result = redisTemplate.opsForValue().setIfAbsent(RedisCacheKey.SEALED_USER_AUCTION_LOCK.key(userId), "Y");
        if (result) {
            redisTemplate.expire(RedisCacheKey.SEALED_USER_AUCTION_LOCK.key(userId), CacheKey.MINUTE_1, TimeUnit.SECONDS);
        }
        return result;
    }

    /**
     * 解锁用户出价
     *
     * @param userId 用户id
     */
    public void unlock(long userId) {
        redisTemplate.delete(RedisCacheKey.SEALED_USER_AUCTION_LOCK.key(userId));
    }

    /**
     * 按照暗拍排名规则排序返回所有的用户出价信息
     *
     * @param auctionId 拍卖id
     * @return
     */
    public List<SealedAuctionInfo> getAllWithSort(long auctionId) {
        Map<String, SealedAuctionInfo> map = redisTemplate.boundHashOps(RedisCacheKey.SEALED_AUCTION_INFO.key(auctionId)).entries();
        if (map == null) {
            return Collections.emptyList();
        }
        List<SealedAuctionInfo> list = new ArrayList<>(map.values());
        Collections.sort(list);
        return list;
    }

    /**
     * 批量保存暗拍定价排名记录
     *
     * @param auctionId 拍卖id
     * @param infoList  暗拍定价排名记录
     */
    public void saveSealedAuctionRankings(long auctionId, List<SealedAuctionInfo> infoList) {
        sealedAuctionRankingService.saveSealedAuctionRankings(auctionId, infoList);
    }

    /**
     * 获取暗拍场我的排名
     *
     * @param auctionId 拍卖id
     * @param userId    用户id
     * @return
     */
    public SealedAuctionRanking getMyRanking(long auctionId, long userId) {
        return sealedAuctionRankingService.getMyRanking(auctionId, userId);
    }

    /**
     * 分页查询暗拍定价排名列表
     *
     * @param auctionId 拍卖id
     * @param page      页数
     * @return
     */
    public List<SealedAuctionRankingInfo> findByPage(long auctionId, int page) {
        return sealedAuctionRankingService.findByPage(auctionId, page);
    }
}
