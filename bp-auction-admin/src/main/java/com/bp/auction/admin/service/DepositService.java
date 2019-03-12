package com.bp.auction.admin.service;


import com.bp.auction.common.constants.RedisCacheKey;
import com.bp.auction.common.service.bo.DepositUserInfo;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.collections.MapUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.Iterator;
import java.util.Map;

/**
 * 处理托管业务的service
 *
 * @author zc
 * @create 2018-12-19 17:11
 * @desc
 **/
@Service
@Slf4j
public class DepositService {
    @Autowired
    private RedisTemplate redisTemplate;

    /***
     * 某场次托管的用户
     * @param auctionId
     * @return
     */
    private String getDepositCacheKey(long auctionId) {
        return RedisCacheKey.DEPOSIT_RECORD.key(auctionId);
    }

    /***
     * 用户托管的场次ID
     * @param userId
     * @return
     */
    private String getUserDepositRecordCacheKey(long userId) {
        return RedisCacheKey.USER_DEPOSIT_RECORD.key(userId);
    }

    /***
     * 获取某期所有的用户托管信息
     * @param auctionId
     * @return
     */
    public Map<String, DepositUserInfo> getAllDepositInfo(long auctionId) {
        String cacheKey = getDepositCacheKey(auctionId);
        Map<String, DepositUserInfo> map = redisTemplate.opsForHash().entries(cacheKey);
        return map;
    }

    /***
     * 删除用户托管的场次记录
     * @param userId
     * @param auctionId
     */
    public void delUserDepositRecord(long userId, Long... auctionId) {
        String key = getUserDepositRecordCacheKey(userId);
        redisTemplate.opsForSet().remove(key, auctionId);
    }

    /***
     * (用于禁用某个场次时)删除某一个场次下面用户所有托管记录
     * @param auctionId
     */
    public void delAllUserDepositRecord(long auctionId) {
        Map<String, DepositUserInfo> map = getAllDepositInfo(auctionId);
        if (MapUtils.isNotEmpty(map)) {
            Iterator<String> it = map.keySet().iterator();
            while (it.hasNext()) {
                String sUserId = it.next();
                delUserDepositRecord(Long.parseLong(sUserId), auctionId);
            }
            redisTemplate.delete(getDepositCacheKey(auctionId));
        }
    }
}
