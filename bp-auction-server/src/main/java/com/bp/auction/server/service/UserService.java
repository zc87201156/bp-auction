package com.bp.auction.server.service;

import com.bp.auction.common.constants.AuctionConstants;
import com.bp.auction.common.constants.BusinessType;
import com.bp.auction.common.constants.ErrorCode;
import com.bp.auction.common.constants.RedisCacheKey;
import com.bp.auction.server.cache.UserInfoCache;
import com.bp.auction.server.handler.HttpApiHandler;
import com.bp.auction.server.rpc.AuctionRpc;
import com.bp.core.cache.CacheKey;
import com.bp.core.utils.TraceIdUtils;
import com.bp.core.utils.type.DateUtils;
import com.bp.platform.rpc.dto.ChannelInfoDto;
import com.bp.platform.rpc.dto.TransAccountDto;
import com.bp.platform.rpc.dto.UserDto;
import com.bp.platform.rpc.dto.UserInfoDto;
import com.wf.trans.rpc.dto.RpcRequest;
import com.wf.trans.rpc.dto.RpcResponse;
import com.wf.trans.rpc.dto.TransactionLogDto;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang.exception.ExceptionUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.BoundValueOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Date;
import java.util.concurrent.TimeUnit;



/**
 * 用户服务，提供跟用户相关的服务
 *
 * @author zwf
 */
@Service
@Slf4j
public class UserService{
    @Autowired
    private ConfigService configService;

    @Autowired
    private HttpApiHandler httpApiHandler;

    @Autowired
    private RedisTemplate redisTemplate;

    @Autowired
    private WebSocketService webSocketService;

    @Autowired
    private AuctionRpc auctionRpc;

    private static final String BLANK = "";

    /**
     * 获取用户的贵族等级
     *
     * @param userId 用户id
     * @return
     */
    public Integer getVipLevelByUserId(long userId) {
        Integer vipLevel = UserInfoCache.getVipLevelByUserId(userId);
        if (vipLevel == null) {
            vipLevel = httpApiHandler.getCatVipLev(userId);
            if (vipLevel != null) {
                UserInfoCache.addUserVipLevel(userId, vipLevel);
            }
        }
        return vipLevel;
    }

    /**
     * 获取某个用户的信息
     *
     * @param userId 用户id
     * @return
     */
    public UserDto getByUserId(long userId) {
        UserDto user = UserInfoCache.getByUserId(userId);
        if (user == null) {
            user = httpApiHandler.getByUserId(userId);
            if (user != null) {
                UserInfoCache.addUser(user);
            }
        }
        return user;
    }

    /**
     * 获取某个渠道id的父渠道id，如父渠道id不存在则返回渠道id
     *
     * @param channelId 渠道id
     * @return
     */
    public Long getParentChannelId(Long channelId) {
        if (channelId == null) {
            return null;
        }
        ChannelInfoDto channel = httpApiHandler.getParentChannel(channelId);
        return channel == null ? channelId : channel.getId();
    }

    /**
     * 获取某用户的渠道ID
     *
     * @param userId
     * @return
     */
    public Long getUserChannelId(long userId) {
        UserDto userDto = getByUserId(userId);
        if (userDto == null) {
            return null;
        }
        //先获取上次登录渠道ID
        Long channelId = userDto.getLastLoginChannelId();
        if (channelId == null) {
            channelId = getParentChannelId(userDto.getRegParentChannel());
        }
        return channelId;
    }

    /**
     * 根据token获取用户信息
     *
     * @param token
     * @return
     */
    public UserInfoDto getUserByToken(String token) {
        return httpApiHandler.getUserInfo(token);
    }

    /**
     * 获取用户的账户余额
     *
     * @param userId 用户id
     * @return
     */
    public long getAccountBalance(long userId) {
        TransAccountDto accountDto = httpApiHandler.getAccountByUserId(userId);
        if (accountDto == null) {
            return 0L;
        }
        Double useAmount = accountDto.getUseAmount();
        return useAmount == null ? 0L : useAmount.longValue();
    }

    /**
     * 更新用户的金叶子
     *
     * @param userId       用户id
     * @param channelId    渠道id
     * @param amount       金叶子数
     * @param businessType 业务类型
     * @param businessId   业务id
     * @return ErrorCode.FAILURE-扣除失败，ErrorCode.SUCCESS-扣除成功，ErrorCode.LOCK_ACCOUNT_FAILED-锁定账户失败,
     * ErrorCode.USER_BALANCE_NOT_ENOUGH 余额不足
     */
    public int updateUserCoin(long userId, long channelId, long amount, BusinessType businessType, long businessId) {
        long start = System.currentTimeMillis();
        try {
            TransactionLogDto transactionLog = new TransactionLogDto();
            transactionLog.setBusinessType(businessType.getValue());
            transactionLog.setChangeUseMoney(-amount);
            transactionLog.setBusinessId(businessId);
            transactionLog.setRemark(businessType.getRemark());
            transactionLog.setUserId(userId);
            transactionLog.setChannelId(channelId);
            transactionLog.setGameId(AuctionConstants.GAME_ID);

            RpcRequest<TransactionLogDto> request = new RpcRequest<>();

            request.setData(transactionLog);
            request.setTraceId(AuctionConstants.GAME_ID + "-" + TraceIdUtils.getTraceId());

            RpcResponse<com.wf.trans.rpc.dto.TransAccountDto> rpcResponse = auctionRpc.updateAccount(request);

            if (!rpcResponse.isSuccess()) {
                log.error("call update account failed. userId:{}, return code:{}, msg:{}", userId,
                        rpcResponse.getCode(), rpcResponse.getMsg());
                return ErrorCode.USER_BALANCE_NOT_ENOUGH;
			}
            BigDecimal balance = new BigDecimal(rpcResponse.getData().getUseAmount() + BLANK);
            webSocketService.sendUserAccountBalanceMessage(userId, balance.longValue());
            long ms = System.currentTimeMillis() - start;
            if (ms > 50L) {
				log.warn("complete updateUserCoin in {} ms.", ms);
			}
            return ErrorCode.SUCCESS;
        } catch (Exception e) {
            log.error("call update account error, userId:{}, ex:{}", userId, ExceptionUtils.getStackTrace(e));
            return ErrorCode.USER_BALANCE_NOT_ENOUGH;
        }
    }

    /**
     * 返回用户当前所在的拍卖场次,如果用户不在任何拍卖场次中则返回null
     *
     * @param userId 用户id
     * @return 拍卖id
     */
    public Long getCurrentAuctionId(long userId) {
        return (Long) redisTemplate.opsForValue().get(RedisCacheKey.USER_CURRENT_AUCTION_ID.key(userId));
    }

    /**
     * 设置用户当前所在的拍卖场次
     *
     * @param userId    用户id
     * @param auctionId 拍卖id
     */
    public void setCurrentAuctionId(long userId, Long auctionId) {
        BoundValueOperations bvo = redisTemplate.boundValueOps(RedisCacheKey.USER_CURRENT_AUCTION_ID.key(userId));
        bvo.set(auctionId, CacheKey.HOUR_2, TimeUnit.SECONDS);
    }

    /**
     * 判断用户是否是黑名单用户,目前实现为是否是平台灰名单用户
     *
     * @param userId 用户id
     * @return true-是黑名单，false-不是黑名单
     */
    public boolean isBlackList(long userId) {
        return httpApiHandler.isGray(userId);
    }

    /**
     * 获取用户某天拍中的次数
     *
     * @param userId 用户id
     * @param date   日期
     * @return
     */
    public int getAuctionSuccessTimesByDay(long userId, Date date) {
        if (date == null) {
            return 0;
        }
        String dateStr = DateUtils.formatDate(date);
        Integer num = (Integer) redisTemplate.opsForValue().get(RedisCacheKey.USER_AUCTION_SUCCESS_TIMES_BY_DAY.key(dateStr, userId));
        return num == null ? 0 : num;
    }

    /**
     * 用户今天的拍中次数+1
     *
     * @param userId 用户id
     * @return 返回更新后的拍中次数
     */
    public void incrTodayAuctionSuccessTimes(long userId) {
        String dateStr = DateUtils.formatDate(new Date());
        BoundValueOperations operations = redisTemplate.boundValueOps(RedisCacheKey.USER_AUCTION_SUCCESS_TIMES_BY_DAY.key(dateStr, userId));
        operations.expire(CacheKey.MONTH_1, TimeUnit.SECONDS);
        operations.increment(1);
        //用户拍中次数发生变化后，清除该用户的小户接口缓存
        redisTemplate.delete(RedisCacheKey.SMALL_USER.key(userId));
    }

    /**
     * 判断用户是否是小户。 小户的定义：从当前日期往前推N天，用户拍中的次数(包含今天的)小于设定值
     *
     * @param userId 用户id
     * @return true-是，false-否
     */
    public boolean isSmallUser(long userId) {
        BoundValueOperations operations = redisTemplate.boundValueOps(RedisCacheKey.SMALL_USER.key(userId));
        Object val=operations.get();
        if(val==null){
            //最近一段时间(往前推N天)
            int dateRange = configService.getSmallUserDateRange();
            //拍中的次数小于此值
            int times = configService.getSmallUserAuctionSuccessTimes();
            if (dateRange < 0) {
                dateRange = 6;//默认往前推6天
            }
            if (times <= 0) {
                times = 6;//默认拍中小于6次
            }
            Date today = new Date();
            //用户最近一段时间总的拍中次数
            int total = getAuctionSuccessTimesByDay(userId, today);
            for (int i = 1; i <= dateRange; i++) {
                Date date = DateUtils.addDays(today, -i);
                total += getAuctionSuccessTimesByDay(userId, date);
            }
            val= total < times;
            operations.set(val,CacheKey.MINUTE_1,TimeUnit.SECONDS);
        }
        return Boolean.parseBoolean(val + "");
    }
}
