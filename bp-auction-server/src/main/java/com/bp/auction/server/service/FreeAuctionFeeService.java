package com.bp.auction.server.service;

import com.bp.auction.common.constants.BusinessType;
import com.bp.auction.common.constants.ErrorCode;
import com.bp.auction.common.constants.RedisCacheKey;
import com.bp.auction.common.dal.entity.ViolationUser;
import com.bp.auction.common.dal.entity.ViolationUserBailLog;
import com.bp.auction.common.dal.entity.ViolationUserLog;
import com.bp.core.cache.CacheKey;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.BoundSetOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.concurrent.TimeUnit;

/**
 * 免手续费服务
 *
 * @author zwf
 */
@Service
public class FreeAuctionFeeService {

    @Autowired
    private RedisTemplate redisTemplate;

    @Autowired
    private ViolationUserService violationUserService;

    @Autowired
    private ViolationUserLogService violationUserLogService;

    @Autowired
    private ViolationUserBailLogService violationUserBailLogService;

    @Autowired
    private UserService userService;

    private static final String BLANK = "";

    /**
     * 报名锁
     *
     * @param userId 用户id
     * @return
     */
    public boolean lockEnroll(long userId) {
        Boolean result = redisTemplate.opsForValue().setIfAbsent(RedisCacheKey.FREE_AUCTION_FEE_ENROLL_LOCK.key(userId), "Y");
        if (result) {
            redisTemplate.expire(RedisCacheKey.FREE_AUCTION_FEE_ENROLL_LOCK.key(userId), CacheKey.MINUTE_1, TimeUnit.SECONDS);
        }
        return result;
    }

    /**
     * 解锁报名
     *
     * @param userId 用户id
     */
    public void unlockEnroll(long userId) {
        redisTemplate.delete(RedisCacheKey.FREE_AUCTION_FEE_ENROLL_LOCK.key(userId));
    }

    /**
     * 交保证金锁
     *
     * @param userId 用户id
     * @return
     */
    public boolean lockPayBailFee(long userId) {
        Boolean result = redisTemplate.opsForValue().setIfAbsent(RedisCacheKey.FREE_AUCTION_FEE_PAY_BAIL_LOCK.key(userId), "Y");
        if (result){
            redisTemplate.expire(RedisCacheKey.FREE_AUCTION_FEE_PAY_BAIL_LOCK.key(userId),CacheKey.MINUTE_1,TimeUnit.SECONDS);
        }
        return result;
    }

    /**
     * 解锁保证金
     *
     * @param userId 用户id
     */
    public void unlockPayBailFee(long userId) {
        redisTemplate.delete(RedisCacheKey.FREE_AUCTION_FEE_PAY_BAIL_LOCK.key(userId));
    }


    /**
     * 判断用户是否在指定的免手续费场报名
     *
     * @param auctionId 拍卖id
     * @param userId    用户id
     * @return true-已报名，false-未报名
     */
    public boolean isEnrollUser(long auctionId, long userId) {
        BoundSetOperations boundSetOperations = redisTemplate.boundSetOps(RedisCacheKey.FREE_AUCTION_FEE_ENROLL_USERS.key(auctionId));
        return boundSetOperations.isMember(userId + BLANK);
    }

    /**
     * 免手续费场报名
     *
     * @param auctionId 拍卖id
     * @param userId    用户id
     * @return true-报名成功，false-已报名
     */
    public void enroll(long auctionId, long userId) {
        BoundSetOperations boundSetOperations = redisTemplate.boundSetOps(RedisCacheKey.FREE_AUCTION_FEE_ENROLL_USERS.key(auctionId));
        boundSetOperations.add(userId + BLANK);
        boundSetOperations.expire(CacheKey.DAY_2,TimeUnit.SECONDS);
    }

    /**
     * 获取违约用户信息
     * @param userId 用户id
     * @return
     */
    public ViolationUser getViolationUser(long userId) {
        return violationUserService.getByUserId(userId);
    }

    /**
     * 是否是违约用户
     * @param vu 违约用户信息
     * @return true-是，false-否
     */
    public boolean isViolationUser(ViolationUser vu) {
        return violationUserService.isViolationUser(vu);
    }

    /**
     * 用户支付保证金
     *
     * @param userId     用户id
     * @param bailAmount 保证金额
     * @return
     */
    public int payBailFee(long userId, long channelId, long bailAmount) {
        ViolationUserBailLog log = new ViolationUserBailLog();
        log.setUserId(userId);
        log.setBailAmount(bailAmount);
        log.setCreateTime(new Date());
        violationUserBailLogService.save(log);
        int code = userService.updateUserCoin(userId, channelId, bailAmount, BusinessType.VIOLATION_USER_BAIL_FEE, log.getId());
        //如果扣除成功，则保存保证金交付记录并清除违约信息
        if (code == ErrorCode.SUCCESS) {
            //清除违约信息
            violationUserService.clear(userId);
        }
        return code;
    }

    /**
     * 某条违约用户记录完成支付
     *
     * @param auctionId   拍卖id
     * @param paymentTime 支付时间
     */
    public void completePayment(long auctionId, Date paymentTime) {
        violationUserLogService.completePayment(auctionId, paymentTime);
    }

    /**
     * 查询已过期未处理的违约用户记录
     *
     * @return
     */
    public List<ViolationUserLog> findViolationList() {
        return violationUserLogService.findViolationList();
    }

    /**
     * 处理某条违约用户记录
     *
     * @param log 违约用户记录
     * @return true-处理成功，false-处理失败
     */
    public boolean processViolationUserLog(ViolationUserLog log) {
        return violationUserLogService.process(log);
    }
}
