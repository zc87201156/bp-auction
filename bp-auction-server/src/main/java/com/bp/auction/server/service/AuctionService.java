package com.bp.auction.server.service;

import com.bp.auction.common.constants.*;
import com.bp.auction.common.dal.entity.Auction;
import com.bp.auction.common.dal.entity.AuctionFee;
import com.bp.auction.common.dal.entity.Beginner;
import com.bp.auction.common.dal.entity.Goods;
import com.bp.auction.common.queue.message.DelayMessage;
import com.bp.auction.common.queue.message.DelayMessageType;
import com.bp.auction.common.service.DelayMessageService;
import com.bp.auction.common.util.SysUtil;
import com.bp.auction.server.controller.response.RecentAuctionRsp;
import com.bp.auction.server.dal.mapper.AuctionMapper;
import com.bp.auction.server.handler.HttpApiHandler;
import com.bp.auction.server.redis.RedisLuaScriptService;
import com.bp.auction.server.service.bo.AuctionInfo;
import com.bp.auction.server.service.bo.SealedAuctionInfo;
import com.bp.core.base.BaseServiceImpl;
import com.bp.core.cache.CacheKey;
import com.bp.core.utils.exception.BusinessCommonException;
import com.bp.core.utils.type.BigDecimalUtil;
import com.bp.platform.rpc.dto.UserDto;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.data.redis.core.BoundSetOperations;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.concurrent.TimeUnit;

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
    private RedisLuaScriptService redisLuaScriptService;

    @Autowired
    private GoodsService goodsService;

    @Autowired
    private AuctionFeeService auctionFeeService;

    @Autowired
    private AuctionHistoryService auctionHistoryService;

    @Autowired
    private BeginnerService beginnerService;

    @Autowired
    private FreeAuctionFeeService freeAuctionFeeService;

    @Autowired
    private AuctionAttributeService auctionAttributeService;

    @Autowired
    private WebSocketService webSocketService;

    @Autowired
    private ActivityService activityService;

    @Autowired
    private SealedAuctionService sealedAuctionService;

    @Autowired
    private UserService userService;

    @Autowired
    private ConfigService configService;

    @Autowired
    private DelayMessageService delayMessageService;

    @Autowired
    private HttpApiHandler httpApiHandler;

    @Autowired
    @Lazy
    private DepositService depositService;

    @Override
    protected void clearCache(Auction entity) {
        if (entity != null && entity.getId() != null) {
            redisTemplate.delete(RedisCacheKey.AUCTION_INFO_BY_ID.key(entity.getId()));
            redisTemplate.delete(RedisCacheKey.GOODS_AUCTION_NEXT.key(entity.getEnvironment(), entity.getGoodsId()));
        }
    }

    /**
     * 用户出价
     *
     * @param auctionId 拍卖id
     * @param userId    用户id
     * @param channelId 用户渠道id
     */
    public AuctionInfo auction(long auctionId, long userId, long channelId, OperateType operateType) {
        long time1 = System.currentTimeMillis();
        AuctionInfo auctionInfo = getAuctionInfoById(auctionId);
        log.info("getAuctionInfoById耗时:{}", System.currentTimeMillis() - time1);
        //拍卖信息不存在
        if (auctionInfo == null) {
            throw new BusinessCommonException(ErrorCode.AUCTION_INFO_NOT_EXISTS);
        }

        AuctionStatus status = auctionInfo.getAuctionStatus();
        //拍卖未开始
        if (status == AuctionStatus.NO_AUCTION) {
            throw new BusinessCommonException(ErrorCode.AUCTION_HAS_NOT_STARTED);
        }
        //拍卖已结束(成交或流拍)
        if (status == AuctionStatus.SUCCESS || status == AuctionStatus.FAILED) {
            throw new BusinessCommonException(ErrorCode.AUCTION_IS_OVER);
        }

        AuctionClass auctionClass = auctionInfo.getAuctionClass();
        //防止恶意用户给暗拍场发送普通出价请求
        if (auctionClass == AuctionClass.SEALED) {
            throw new BusinessCommonException(ErrorCode.ILLEGAL_OPERATION);
        }

        Long currentUserId = auctionInfo.getCurrentUserId();
        //用户已领先判断
        if (currentUserId != null && currentUserId == userId) {
            throw new BusinessCommonException(ErrorCode.USER_AUCTION_LEAD);
        }

        //免手续费场加价不能超过市场价(仅粗略判断，不做精确控制)
        if (auctionClass == AuctionClass.FREE_AUCTION_FEE && auctionInfo.getFreeRaisePrice() != null) {
            BigDecimal num = BigDecimalUtil.add(auctionInfo.getCurrentPrice(), auctionInfo.getFreeRaisePrice());
            if (num.compareTo(auctionInfo.getMarketPrice()) > 0) {
                throw new BusinessCommonException(ErrorCode.CURRENT_PRICE_OVER_MARKET);
            }
        }

        Beginner beginner = beginnerService.getByUserId(userId);
        boolean isBeginner = beginnerService.isBeginner(beginner);

        log.info("获取新手信息之后耗时:{}", System.currentTimeMillis() - time1);

        //非新小户不能进新小户场
        if (!isBeginner && auctionClass == AuctionClass.BEGINNER) {
            throw new BusinessCommonException(ErrorCode.BEGINNER_FORBIDDEN);
        }

        //判断用户是否首次出价
        boolean firstAuction = beginnerService.isFirstAuction(beginner);
        //新小户首次出价免费
        boolean free = firstAuction && auctionClass == AuctionClass.BEGINNER;

        //如果是免手续费场
        if (auctionClass == AuctionClass.FREE_AUCTION_FEE) {
            boolean isEnroll = freeAuctionFeeService.isEnrollUser(auctionId, userId);
            //用户未报名
            if (!isEnroll) {
                throw new BusinessCommonException(ErrorCode.NOT_ENROLL_FREE_AUCTION_FEE);
            }
        }

        //获取用户信息
        UserDto user = userService.getByUserId(userId);
        if (user == null) {
            log.error("auction failed. user info not exists in local cache. auctionId:{}, userId:{}",
                    auctionId, userId);
            throw new BusinessCommonException(ErrorCode.FAILURE);
        }

        log.info("获取用户信息之后耗时:{}", System.currentTimeMillis() - time1);

        //生成出价记录id
        long newAuctionHistoryId = auctionHistoryService.nextId();

        log.info("nextId之后耗时:{}", System.currentTimeMillis() - time1);

        //抬价幅度
        BigDecimal feePrice = auctionInfo.getAuctionFeePrice();

        //非免费并且当前场次为非免费场时才需要扣手续费
        if (!free && auctionClass != AuctionClass.FREE_AUCTION_FEE) {
            //扣除用户的手续费
            int code = userService.updateUserCoin(userId, channelId, auctionInfo.getAuctionFee(), BusinessType.AUCTION_FEE,
                    newAuctionHistoryId);
            if (code != ErrorCode.SUCCESS) {
                log.error("deduct auction fee failed. code:{}, auctionId:{}, userId:{}, fee:{}, price:{}",
                        code, auctionId, userId, auctionInfo.getAuctionFee(), feePrice);
                throw new BusinessCommonException(code);
            }
        }
        log.info("扣钱之后耗时:{}", System.currentTimeMillis() - time1);
        Integer vipLevel = userService.getVipLevelByUserId(userId);

        //拍卖倒计时
        long countdownTime = configService.getAuctionCountDownSeconds() * 1000L;

        //用户出价
        List list = redisLuaScriptService.auction(auctionId, userId, countdownTime);
        Long code = (Long) list.get(0);

        log.info("lua脚本执行之后耗时:{}", System.currentTimeMillis() - time1);

        //如果用户出价不成功
        if (code != ErrorCode.SUCCESS) {
            throw new BusinessCommonException(code.intValue());
        }
        //由lua脚本生成的延迟消息计数值
        Long delayMessageCount = (Long) list.get(2);

        AuctionInfo newAuctionInfo = (AuctionInfo) list.get(1);
        //由于lua脚本不更新用户昵称头像贵族等级等字段，因此需重新设置
        newAuctionInfo.setNickname(user.getNickname());
        newAuctionInfo.setHeadImg(user.getHeadImg());
        newAuctionInfo.setVipLevel(vipLevel);

        //更新已出价人数
        updateAuctionedUserCount(newAuctionInfo, userId);

        log.info("更新已出价人数之后耗时:{}", System.currentTimeMillis() - time1);

        //保存出价记录
        auctionHistoryService.asyncSave(newAuctionHistoryId, userId, user.getNickname(), user.getHeadImg(), vipLevel,
                auctionId, auctionInfo.getAuctionFee(), operateType, newAuctionInfo.getCurrentPrice(),
                System.currentTimeMillis(), newAuctionInfo.getAuctionTimes());
        //更新用户首次出价时间
        beginnerService.updateFirstAuctionTime(beginner, System.currentTimeMillis());

        log.info("更新用户首次出价时间之后耗时:{}", System.currentTimeMillis() - time1);

        //处理活动相关的
        activityService.dealActivity(userId, ActivityOperateType.AUCTION);

        DelayMessage message = new DelayMessage(DelayMessageType.END_AUCTION, auctionId, null, null, delayMessageCount);
        //发送拍卖结束延迟消息
        delayMessageService.send(message, newAuctionInfo.getEndTime());

        log.info("发送延迟消息之后耗时:{}", System.currentTimeMillis() - time1);

        //给所有已订阅用户推送该用户出价信息
        webSocketService.sendAuctionMessage(newAuctionInfo);

        log.info("总耗时:{}", System.currentTimeMillis() - time1);
        return newAuctionInfo;
    }

    /**
     * 拍卖结束
     *
     * @param auctionId 拍卖id
     * @return 如果结束拍卖失败(包含延迟队列消息无效的情况)，则返回null
     */
    public AuctionInfo endAuction(long auctionId,long count) {
        //拍卖成功后允许延迟支付的毫秒
        long auctionDelayPaymentTime = configService.getAuctionDelayPaymentSeconds() * 1000L;
        List result = redisLuaScriptService.endAuction(auctionId, auctionDelayPaymentTime, count);

        //lua脚本返回集合,第一个元素：状态（-2:拍卖信息缓存不存在，-1:延迟消息已无效，0：非进行中的拍卖，1：结束拍卖成功）
        //如结束成功，则将新的拍卖信息存放第二个元素中
        Long code = (Long) result.get(0);
        //返回1表示结束拍卖成功
        if (code != 1) {
            //非延迟消息无效的错误打印出来
            if (code != -1) {
                log.error("endAuction.lua return:{}, auctionId:{}, count:{}", code, auctionId, count);
            }
            return null;
        }

        AuctionInfo auctionInfo = (AuctionInfo) result.get(1);
        //因lua脚本不更新用户昵称头像贵族等级等信息，因此需在此设置用户基本信息
        if (auctionInfo.getAuctionStatus() == AuctionStatus.SUCCESS) {
            UserDto user = userService.getByUserId(auctionInfo.getCurrentUserId());
            if (user != null) {
                auctionInfo.setNickname(user.getNickname());
                auctionInfo.setHeadImg(user.getHeadImg());
            }
            Integer vipLevel = userService.getVipLevelByUserId(auctionInfo.getCurrentUserId());
            auctionInfo.setVipLevel(vipLevel);
        }

        //保存拍卖信息
        saveAuctionInfo(auctionInfo);
        //刷新大厅该拍卖场次类型的id列表缓存
        reloadIdListCacheInHall(auctionInfo.getAuctionClass());
        //刷新往期成交缓存
        reloadRecentSuccessAuctionsCache(auctionInfo.getGoodsId());

        if (auctionInfo.getAuctionStatus() == AuctionStatus.SUCCESS) {
            //清除获胜者数量缓存
            clearUserWinNum(auctionInfo.getCurrentUserId());
            //给成交人发送站内信通知
            String content = String.format(AuctionConstants.AUCTION_MESSAGE_CONTENT, auctionInfo.getGoodsName());
            httpApiHandler.sendMessage(AuctionConstants.AUCTION_MESSAGE_TITLE, content, auctionInfo.getCurrentUserId());
        }
        return auctionInfo;
    }

    /**
     * 暗拍场拍卖结束
     *
     * @param auctionInfo 拍卖信息
     */
    public void endSealedAuction(AuctionInfo auctionInfo) {
        long auctionId = auctionInfo.getId();
        List<SealedAuctionInfo> allSealedAuctionInfo = sealedAuctionService.getAllWithSort(auctionId);

        AuctionStatus status;
        //无人出价则流拍
        if (allSealedAuctionInfo.isEmpty()) {
            status = AuctionStatus.FAILED;
        } else {
            //保存所有用户的定价排名记录
            sealedAuctionService.saveSealedAuctionRankings(auctionId, allSealedAuctionInfo);

            status = AuctionStatus.SUCCESS;
            //排名第一的用户即成交者
            SealedAuctionInfo sai = allSealedAuctionInfo.get(0);
            auctionInfo.setCurrentPrice(sai.getPrice());
            auctionInfo.setCurrentUserId(sai.getUserId());
            auctionInfo.setNickname(sai.getNickname());
            auctionInfo.setHeadImg(sai.getHeadImg());
            auctionInfo.setVipLevel(sai.getVipLevel());

            long ms = auctionInfo.getEndTime().getTime() + configService.getAuctionDelayPaymentSeconds() * 1000L;
            //设置付款截止时间
            auctionInfo.setPaymentEndTime(new Date(ms));

            //给成交人发送站内信通知
            String content = String.format(AuctionConstants.AUCTION_MESSAGE_CONTENT, auctionInfo.getGoodsName());

            httpApiHandler.sendMessage(AuctionConstants.AUCTION_MESSAGE_TITLE, content, auctionInfo.getCurrentUserId());
        }
        auctionInfo.setAuctionStatus(status);

        //保存拍卖信息并更新缓存
        saveAuctionInfo(auctionInfo);
        //刷新大厅该拍卖场次类型的id列表缓存
        reloadIdListCacheInHall(auctionInfo.getAuctionClass());
        //刷新往期成交缓存
        reloadRecentSuccessAuctionsCache(auctionInfo.getGoodsId());

        if (status == AuctionStatus.SUCCESS) {
            //清除获胜者数量缓存
            clearUserWinNum(auctionInfo.getCurrentUserId());
        }
    }

    /**
     * 查询某个商品往期成交拍卖
     *
     * @param goodsId 商品id
     * @return
     */
    public List<RecentAuctionRsp> findRecentSuccessAuctions(long goodsId) {
        return cache(RedisCacheKey.LAST_SUCCESS_AUCTIONS.key(goodsId),
                () -> {
                    int num = configService.getRecentAuctionNum();
                    List<Auction> list = baseMapper.findLastAuctions(goodsId, AuctionStatus.SUCCESS.getValue(), num);
                    List<RecentAuctionRsp> result = new ArrayList<>(list.size());
                    for (Auction a : list) {
                        result.add(new RecentAuctionRsp(a));
                    }
                    return result;
                }, CacheKey.HOUR_1);
    }

    /**
     * 刷新某个商品的往期成交
     *
     * @param goodsId 商品id
     */
    private void reloadRecentSuccessAuctionsCache(long goodsId) {
        redisTemplate.delete(RedisCacheKey.LAST_SUCCESS_AUCTIONS.key(goodsId));
    }

    /**
     * 更新某场拍卖已出价人数
     *
     * @param auctionInfo 拍卖信息
     * @param userId      用户id
     * @return true-出价人数有变化，false-出价人数无变化
     */
    public void updateAuctionedUserCount(AuctionInfo auctionInfo, long userId) {
        long auctionId = auctionInfo.getId();
        boolean change = auctionAttributeService.addAuctionedUser(auctionId, userId);
        //如果出价人数发生变化
        if (change) {
            int count = auctionAttributeService.getAuctionedUserCount(auctionId, auctionInfo.getAuctionStatus());
            //推送拍卖实时信息给已订阅的客户端
            webSocketService.sendAuctionRealtimeInfoMessage(auctionInfo.getId(), null, count);
        }
    }

    /**
     * 根据拍卖id获取拍卖信息
     *
     * @param id 拍卖id
     * @return 返回包含商品基本信息的拍卖信息
     */
    public AuctionInfo getAuctionInfoById(Long id) {
        if (id == null) {
            return null;
        }
        AuctionInfo auctionInfo = cache(RedisCacheKey.AUCTION_INFO_BY_ID.key(id), () -> {
            Auction auction = super.baseMapper.selectById(id);
            if (auction == null || auction.getEnable() == null || auction.getEnable() != Status.ENABLE.getValue()) {
                return null;
            }
            Goods goods = goodsService.get(auction.getGoodsId());
            if (goods == null) {
                log.error("auction[{}] info error. goodsId[{}] is not exists.", id, auction.getGoodsId());
                return null;
            }
            AuctionFee fee = auctionFeeService.get(goods.getAuctionFeeId());
            if (fee == null) {
                log.error("auction[{}] info error. auction fee id[{}] not exists. goodsId:{}", id,
                        goods.getAuctionFeeId(), goods.getId());
                return null;
            }

            AuctionInfo info = new AuctionInfo();
            info.setId(auction.getId());
            info.setGoodsId(auction.getGoodsId());
            info.setStartTime(auction.getStartTime());
            info.setEndTime(auction.getEndTime());
            info.setCurrentPrice(auction.getCurrentPrice());
            info.setCurrentUserId(auction.getCurrentUserId());
            info.setPaymentEndTime(auction.getPaymentEndTime());
            info.setStatus(Status.getByValue(auction.getEnable()));
            info.setAuctionStatus(AuctionStatus.getByValue(auction.getAuctionStatus()));
            info.setPaymentStatus(PaymentStatus.getByValue(auction.getPaymentStatus()));
            info.setPaymentOrderNo(auction.getPaymentOrderNo());
            info.setPaymentTime(auction.getPaymentTime());
            info.setNextId(auction.getNextId());
            info.setType(AuctionType.getByValue(auction.getType()));
            info.setRollAuctionId(auction.getRollAuctionId());
            info.setAuctionClass(AuctionClass.getByValue(auction.getAuctionClass()));
            if (auction.getCanDeposit() != null) {
                info.setCanDeposit(YesOrNo.getByValue(auction.getCanDeposit()));
            }
            info.setFreeEntryFee(auction.getFreeEntryFee());
            info.setFreeRaisePrice(auction.getFreeRaisePrice());
            info.setGoodsNo(goods.getNo());
            info.setGoodsName(goods.getName());
            info.setDefaultGoodsImage(goods.getDefaultImage());
            info.setGoodsImages(goods.getImages());
            info.setMarketPrice(goods.getMarketPrice());
            info.setStartPrice(goods.getStartPrice());
            info.setAuctionFee(fee.getFee());
            info.setAuctionFeePrice(fee.getPrice());
            return info;
        }, CacheKey.DAY_1);

        if (auctionInfo != null && auctionInfo.getCurrentUserId() != null) {
            //获取用户信息
            UserDto user = userService.getByUserId(auctionInfo.getCurrentUserId());
            if (user != null) {
                auctionInfo.setNickname(user.getNickname());
                auctionInfo.setHeadImg(user.getHeadImg());
            }
            Integer vipLevel = userService.getVipLevelByUserId(auctionInfo.getCurrentUserId());
            auctionInfo.setVipLevel(vipLevel);
        }
        return auctionInfo;
    }

    /**
     * 更新拍卖信息至数据库中
     *
     * @param auctionInfo 拍卖信息
     */
    public void saveAuctionInfo(AuctionInfo auctionInfo) {
        if (auctionInfo == null) {
            return;
        }
        Long auctionId = auctionInfo.getId();
        Auction auction = baseMapper.selectById(auctionId);
        if (auction == null) {
            log.error("auction[{}] not found in db.", auctionInfo.getId());
            return;
        }

        auction.setCurrentPrice(auctionInfo.getCurrentPrice());
        auction.setCurrentUserId(auctionInfo.getCurrentUserId());
        auction.setNickname(auctionInfo.getNickname());
        auction.setHeadImg(auctionInfo.getHeadImg());
        auction.setVipLevel(auctionInfo.getVipLevel());
        //auction.setCity(auctionInfo.getCity());
        auction.setEndTime(auctionInfo.getEndTime());
        auction.setPaymentEndTime(auctionInfo.getPaymentEndTime());
        auction.setAuctionStatus(auctionInfo.getAuctionStatus().getValue());
        auction.setPaymentStatus(auctionInfo.getPaymentStatus().getValue());
        auction.setPaymentOrderNo(auctionInfo.getPaymentOrderNo());
        auction.setPaymentTime(auctionInfo.getPaymentTime());
        auction.setNextId(auctionInfo.getNextId());
        save(auction);
        //重新刷新缓存
        getAuctionInfoById(auctionId);
    }

    /**
     * 拍卖开始
     *
     * @param auctionInfo 拍卖信息
     */
    public void startAuction(AuctionInfo auctionInfo) {
        //非暗拍场计算拍卖预计结束时间
        if (auctionInfo.getAuctionClass() != AuctionClass.SEALED) {
            //获取当前服务器时间
            long current = System.currentTimeMillis();
            //设置当前时刻延后10秒为拍卖预计结束时间
            long endTime = current + configService.getAuctionCountDownSeconds() * 1000L;
            //设置拍卖预计结束时间
            auctionInfo.setEndTime(new Date(endTime));
        }
        auctionInfo.setAuctionStatus(AuctionStatus.AUCTIONING);
        //保存拍卖信息并更新缓存
        saveAuctionInfo(auctionInfo);
        //刷新大厅该拍卖场次类型的id列表缓存
        reloadIdListCacheInHall(auctionInfo.getAuctionClass());

        Long auctionId = auctionInfo.getId();

        DelayMessage message = new DelayMessage(DelayMessageType.END_AUCTION, auctionId);

        //发送拍卖结束延迟消息
        delayMessageService.send(message, auctionInfo.getEndTime());

        //初始化该场次的托管用户
        depositService.initAllDeposit(auctionInfo.getId());

        //推送拍卖开始消息给客户端
        webSocketService.sendStartAuctionMessage(auctionInfo.getId(), auctionInfo.getEndTime());
    }

    /**
     * 启用开启拍卖任务
     * @param auction 拍卖
     * @return true-开启成功，false-开启失败
     */
    public boolean enableAuction(Auction auction) {
        //构造拍卖开始延迟消息
        DelayMessage message = new DelayMessage(DelayMessageType.START_AUCTION, auction.getId());
        //向rabbitMQ延迟队列中发送消息
        boolean success = delayMessageService.send(message, auction.getStartTime());
        if (success) {
            //刷新大厅id列表缓存
            reloadIdListCacheInHall(AuctionClass.getByValue(auction.getAuctionClass()));
        }
        return success;
    }

    /**
     * 刷新大厅id列表缓存
     */
    public void reloadIdListCacheInHall(AuctionClass auctionClass) {
        if (auctionClass != null) {
            redisTemplate.delete(RedisCacheKey.AUCTION_HALL_ID_LIST.key(auctionClass.getValue()));
            findIdListInHall(auctionClass);
        }
    }

    /**
     * 获取大厅某场次类型的id列表
     *
     * @param auctionClass 场次类型
     * @return
     */
    public List<Long> findIdListInHall(AuctionClass auctionClass) {
        List<Long> list = cache(RedisCacheKey.AUCTION_HALL_ID_LIST.key(auctionClass.getValue()),
                () -> baseMapper.findIdListInHall(SysUtil.getEnvironment().getValue(), auctionClass.getValue()),
                CacheKey.DAY_1);
        return list == null ? Collections.emptyList() : list;
    }

    /**
     * 某个用户订阅某场拍卖信息变化
     *
     * @param userId    用户id
     * @param auctionId 拍卖id
     */
    public void addAuctionInfoChangeUserId(long userId, long auctionId) {
        BoundSetOperations setOperations = redisTemplate.boundSetOps(RedisWebSocketKey.PUSH_USER_IDS_BY_AUCTION_ID.key(auctionId));
        setOperations.add(userId);
        setOperations.expire(CacheKey.DAY_1, TimeUnit.SECONDS);
    }

    /**
     * 某个用户取消订阅某场拍卖信息变化
     *
     * @param userId    用户id
     * @param auctionId 拍卖id
     */
    public void removeAuctionInfoChangeUserId(long userId, long auctionId) {
        BoundSetOperations setOperations = redisTemplate.boundSetOps(RedisWebSocketKey.PUSH_USER_IDS_BY_AUCTION_ID.key(auctionId));
        setOperations.remove(userId);
    }

    /***
     * 获取某用户拍到未支付的商品数量
     * @param userId
     * @return
     */
    public long getUserWinAuctionNum(long userId) {
        return cache(RedisCacheKey.USER_WIN_AUCTION_NUM.key(userId), () -> baseMapper.getUserWinAuctionNum(userId, new Date()));
    }

    /**
     * 清除用户赢得的拍卖商品数量缓存
     *
     * @param userId 用户id
     */
    public void clearUserWinNum(long userId) {
        redisTemplate.delete(RedisCacheKey.USER_WIN_AUCTION_NUM.key(userId));
    }
}
