package com.bp.auction.server.service;


import com.bp.auction.common.constants.*;
import com.bp.auction.common.queue.message.DelayMessage;
import com.bp.auction.common.queue.message.DelayMessageType;
import com.bp.auction.common.service.DelayMessageService;
import com.bp.auction.common.service.bo.DepositUserInfo;
import com.bp.auction.server.service.bo.AuctionInfo;
import com.bp.core.cache.CacheKey;
import com.bp.core.utils.exception.BusinessCommonException;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.collections.MapUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.BoundHashOperations;
import org.springframework.data.redis.core.BoundSetOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import java.util.*;
import java.util.concurrent.TimeUnit;

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
    @Autowired
    private ConfigService configService;
    @Autowired
    private AuctionService auctionService;
    @Autowired
    private UserService userService;
    @Autowired
    private WebSocketService webSocketService;
    @Autowired
    private DelayMessageService delayMessageService;
    @Autowired
    private StringRedisTemplate stringRedisTemplate;

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
     * 设置更新用户托管信息
     * @param auctionId
     * @param userId
     * @param isAutoNext
     * @param period
     * @param limit
     * @param channelId
     * @param city
     * @param isStart 是否开始
     * @param extraDelay 额外延迟毫秒
     */
    public void setUserDeposit(long auctionId, long userId, int isAutoNext, int period, long limit, long channelId, String city, boolean isStart, long extraDelay) {
        String cacheKey = getDepositCacheKey(auctionId);
        BoundHashOperations operations = redisTemplate.boundHashOps(cacheKey);
        List<DepositUserInfo> list = operations.values();
        DepositUserInfo userInfo = null;
        if (!CollectionUtils.isEmpty(list)) {
            userInfo = list.get(0);
        }
        if (userInfo == null) {
            userInfo = new DepositUserInfo();
            //托管新场次的时候需校验当前托管场次是否已达上限
            boolean canDeposit = judgeUserCanDeposit(userId, auctionId, configService.getUserMaxDeposit());
            if (!canDeposit) {
                throw new BusinessCommonException(ErrorCode.DEPOSIT_AUCTION_OVER_LIMIT, "最多同时托管" + configService.getUserMaxDeposit() + "场");
            }
            //保存用户托管场次记录
            setUserDepositRecord(userId, auctionId);
        }
        userInfo.setUserId(userId);
        userInfo.setIsAutoNext(isAutoNext);
        userInfo.setAuctionPeriod(period);
        userInfo.setAuctionFeeLimit(limit);
        userInfo.setChannelId(channelId);
        userInfo.setCity(city);
        setDepositUserInfo(cacheKey, userInfo);
        //默认如果在拍卖进行中托管，设置的瞬间需要出一次价
        long truePeriod = 0;
        //如果用户在未开始之前设置托管，延时的时间需要加上（开始时间-当前时间)
        if (!isStart) {
            truePeriod = period * 1000 + extraDelay;
        }
        //立即出价一次
        if (truePeriod == 0) {
            depositAuction(auctionId, userId);
        } else {
            //往延迟消息队列放消息
            addDepositDelayMessage(auctionId, userId, truePeriod);
        }
    }

    /***
     * 托管的出价
     * @param auctionId
     * @param userId
     */
    public void depositAuction(long auctionId, long userId) {
        DepositUserInfo depositUserInfo = null;
        try {
            depositUserInfo = getUserDepositInfo(auctionId, userId);
            if (depositUserInfo == null) {
                return;
            }
            AuctionInfo auctionInfo = auctionService.auction(auctionId, userId, depositUserInfo.getChannelId(), OperateType.DEPOSIT);
            //出价成功，发送下一轮出价消息,并且更新托管记录值
            incrUserDeposit(auctionId, depositUserInfo, auctionInfo.getAuctionFee());
            addNextAuction(auctionId, depositUserInfo);
        } catch (BusinessCommonException ex) {
            log.error("depositAuction error:{}", ex.getCode());
            //如果是当前已经领先或未开始的业务异常，仍然继续添加下一轮出价事件
            if (ex.getCode() == ErrorCode.USER_AUCTION_LEAD || ex.getCode() == ErrorCode.AUCTION_HAS_NOT_STARTED) {
                addNextAuction(auctionId, depositUserInfo);
            } else if (ex.getCode() != ErrorCode.AUCTION_IS_OVER) {
                cancelUserDeposit(auctionId, userId, true, "出价异常，自动取消.code:" + ex.getCode());
            }
        }
    }

    /***
     * 取消托管
     * @param auctionId
     * @param userId
     * @param needPush 是否需要通知客户端取消
     */
    public void cancelUserDeposit(long auctionId, long userId, boolean needPush, String remark) {
        String cacheKey = getDepositCacheKey(auctionId);
        redisTemplate.boundHashOps(cacheKey).delete(userId + "");
        //清除用户托管的场次记录
        delUserDepositRecord(userId, auctionId);
        //取消托管，把原来的对应的延迟消息count+1,作废
        delayMessageService.incrMessageCount(new DelayMessage(DelayMessageType.DEPOSIT_AUCTION, auctionId, userId));
        if (needPush) {
            //取消托管了,给用户推一条取消托管的消息
            webSocketService.sendDepositAuctionSuccessMessage(auctionId, 0, 0, 0, userId);
        }
        log.info("user [{}] cancel deposit [{}] success. remark [{}]", userId, auctionId, remark);
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
     * 获取某期某用户的托管信息
     * @param auctionId
     * @param userId
     * @return
     */
    public DepositUserInfo getUserDepositInfo(long auctionId, long userId) {
        String cacheKey = getDepositCacheKey(auctionId);
        Object obj = redisTemplate.boundHashOps(cacheKey).get(userId + "");
        return Objects.isNull(obj) ? null : (DepositUserInfo) obj;
    }

    /***
     * 处理下一期托管的用户
     * @param currentAuctionId
     * @param nextAuctionId
     */
    @Async
    public void dealNextAuction(long currentAuctionId, Long nextAuctionId) {
        Map<String, DepositUserInfo> map = getAllDepositInfo(currentAuctionId);
        //用户最大托管场次
        int userMaxDeposit = configService.getUserMaxDeposit();
        if (MapUtils.isNotEmpty(map)) {
            Map<String, DepositUserInfo> nextMap = new HashMap<>();
            Iterator<DepositUserInfo> it = map.values().iterator();
            while (it.hasNext()) {
                DepositUserInfo depositUserInfo = it.next();
                long userId = depositUserInfo.getUserId();
                //删除用户对应的托管场次
                delUserDepositRecord(depositUserInfo.getUserId(), currentAuctionId);
                //判断是否有下一期
                if (nextAuctionId == null) {
                    continue;
                }
                //如果用户设置下期自动托管，加到下一期的map
                if (depositUserInfo.getIsAutoNext() == YesOrNo.YES.getValue() && depositUserInfo.getCurrentFee() < depositUserInfo.getAuctionFeeLimit()) {
                    //需要校验用户托管场次是否已达上限
                    if (judgeUserCanDeposit(userId, nextAuctionId, userMaxDeposit)) {
                        setUserDepositRecord(userId, nextAuctionId);
                        DepositUserInfo userInfo = new DepositUserInfo();
                        userInfo.setUserId(userId);
                        userInfo.setIsAutoNext(depositUserInfo.getIsAutoNext());
                        userInfo.setAuctionPeriod(depositUserInfo.getAuctionPeriod());
                        userInfo.setAuctionFeeLimit(depositUserInfo.getAuctionFeeLimit());
                        userInfo.setCurrentFee(depositUserInfo.getCurrentFee());
                        userInfo.setCurrentAuctionTimes(depositUserInfo.getCurrentAuctionTimes());
                        userInfo.setChannelId(depositUserInfo.getChannelId());
                        userInfo.setCity(depositUserInfo.getCity());
                        nextMap.put(userId + "", userInfo);
                        //添加到下一期的订阅列表
                        auctionService.addAuctionInfoChangeUserId(userId, nextAuctionId);
                        //保存用户当前的拍卖场次
                        userService.setCurrentAuctionId(userId, nextAuctionId);
                    }
                }
            }
            if (nextMap.size() > 0) {
                String cacheKey = getDepositCacheKey(nextAuctionId);
                BoundHashOperations operations = redisTemplate.boundHashOps(cacheKey);
                operations.expire(CacheKey.DAY_1, TimeUnit.SECONDS);
                operations.putAll(nextMap);
            }
        }
    }

    /**
     * 添加下一次出价消息
     *
     * @param auctionId       拍卖ID
     * @param depositUserInfo 托管用户信息
     */
    private void addNextAuction(long auctionId, DepositUserInfo depositUserInfo) {
        //往延迟消息队列发送消息
        addDepositDelayMessage(auctionId, depositUserInfo.getUserId(), depositUserInfo.getAuctionPeriod() * 1000);
    }

    /***
     * 往延迟队列发送消息
     * @param auctionId 拍卖ID
     * @param userId    用户ID
     * @param delayTime 延迟时间(ms)
     */
    private void addDepositDelayMessage(long auctionId, long userId, long delayTime) {
        //往延迟消息队列发送消息
        DelayMessage message = new DelayMessage(DelayMessageType.DEPOSIT_AUCTION, auctionId, userId);
        delayMessageService.send(message, delayTime);
    }

    /***
     * 出价成功更新托管值
     * @param auctionId 拍卖ID
     * @param userInfo  userInfo
     * @param fee        手续费
     */
    public void incrUserDeposit(long auctionId, DepositUserInfo userInfo, long fee) {
        String cacheKey = getDepositCacheKey(auctionId);
        userInfo.setCurrentAuctionTimes(userInfo.getCurrentAuctionTimes() + 1);
        userInfo.setCurrentFee(userInfo.getCurrentFee() + fee);
        //推送这一轮委托出价的次数
        webSocketService.sendDepositAuctionSuccessMessage(auctionId, userInfo.getCurrentAuctionTimes(), userInfo.getAuctionPeriod(), userInfo.getAuctionFeeLimit(), userInfo.getUserId());
        //如果已经达到限额,自动帮用户取消托管
        if (userInfo.getCurrentFee() >= userInfo.getAuctionFeeLimit()) {
            cancelUserDeposit(auctionId, userInfo.getUserId(), true, "达到限额，自动取消");
        } else {
            setDepositUserInfo(cacheKey, userInfo);
        }
    }

    /***
     * 一场拍卖开始初始化所有托管这场的用户
     * @param auctionId
     */
    public void initAllDeposit(long auctionId) {
        Map<String, DepositUserInfo> map = getAllDepositInfo(auctionId);
        if (MapUtils.isNotEmpty(map)) {
            Iterator<DepositUserInfo> it = map.values().iterator();
            while (it.hasNext()) {
                DepositUserInfo depositUserInfo = it.next();
                addDepositDelayMessage(auctionId, depositUserInfo.getUserId(), depositUserInfo.getAuctionPeriod() * 1000);
            }
        }
    }

    private void setDepositUserInfo(String cacheKey, DepositUserInfo userInfo) {
        BoundHashOperations operations = redisTemplate.boundHashOps(cacheKey);
        operations.put(userInfo.getUserId() + "", userInfo);
        operations.expire(CacheKey.DAY_1, TimeUnit.SECONDS);
    }

    /***
     * 记录用户托管的场次ID
     * @param userId
     * @param auctionId
     */
    public void setUserDepositRecord(long userId, long auctionId) {
        String key = getUserDepositRecordCacheKey(userId);
        BoundSetOperations operation = redisTemplate.boundSetOps(key);
        operation.add(auctionId);
        operation.expire(CacheKey.DAY_1, TimeUnit.SECONDS);
    }

    /***
     * 查询某用户当前托管的所有场次
     * @param userId
     * @return
     */
    public List<Long> getUserDepositRecord(long userId) {
        List<Long> list = new ArrayList<>();
        String key = getUserDepositRecordCacheKey(userId);
        BoundSetOperations operation = redisTemplate.boundSetOps(key);
        Set<Long> set = operation.members();
        for (Long l : set) {
            list.add(l);
        }
        return list;
    }

    /***
     * 判断用户是否可以托管某场次
     * @param userId 用户ID
     * @param auctionId 场次ID
     * @param userDepositMax 托管场次上限
     * @return
     */
    private boolean judgeUserCanDeposit(long userId, long auctionId, int userDepositMax) {
        List<Long> list = getUserDepositRecord(userId);
        if (list == null || list.size() < userDepositMax) {
            return true;
        }
        //把已结束或者过期的场次排除掉
        List<Long> removeList = new ArrayList<>();
        Iterator<Long> it = list.iterator();
        while (it.hasNext()) {
            Long aucId = it.next();
            AuctionInfo auctionInfo = auctionService.getAuctionInfoById(aucId);
            //拍卖被禁用或已结束
            if (auctionInfo == null || auctionInfo.getAuctionStatus() == AuctionStatus.FAILED || auctionInfo.getAuctionStatus() == AuctionStatus.SUCCESS) {
                it.remove();
                removeList.add(aucId);
            }
        }
        if (removeList.size() > 0) {
            delUserDepositRecord(userId, removeList.toArray(new Long[]{}));
        }
        if (list.size() >= userDepositMax && !list.contains(auctionId)) {
            return false;
        }
        return true;
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
}
