package com.bp.auction.server.service;

import com.bp.auction.common.constants.AuctionStatus;
import com.bp.auction.common.constants.ErrorCode;
import com.bp.auction.common.constants.RedisWebSocketKey;
import com.bp.auction.server.service.bo.AuctionInfo;
import com.bp.auction.server.websocket.AbstractMessage;
import com.bp.auction.server.websocket.WebSocketMessage;
import com.bp.auction.server.websocket.message.*;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.time.DateFormatUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.Date;

/**
 * WebSocket消息推送服务
 *
 * @author zwf
 */
@Slf4j
@Async
@Service
public class WebSocketService {

    @Autowired
    private RedisTemplate redisTemplate;

    /**
     * 推送消息 参数auctionId和userId表示推送范围，如果这2个参数都为null，则将消息推送给全部客户端
     *
     * @param message   消息
     * @param auctionId 拍卖id, 如果此参数不为null，则表示推送消息至已订阅该拍卖的用户
     * @param userId    用户id，如果此参数不为null，则表示推送消息至此参数指定的用户
     */
    private void sendMessage(AbstractMessage message, Long auctionId, Long... userId) {
        WebSocketMessage wsm = new WebSocketMessage();
        wsm.setAuctionId(auctionId);
        wsm.setUserIds(userId);
        wsm.setMessage(message.toByteArray());

        redisTemplate.convertAndSend(RedisWebSocketKey.PUSH_CHANNEL.key(), wsm);
    }

    /**
     * 推送消息给全部客户端
     *
     * @param message 消息
     */
    private void sendMessage(AbstractMessage message) {
        sendMessage(message, null);
    }

    /**
     * 推送跑马灯消息给所有客户端
     *
     * @param nickname  用户昵称
     * @param goodsName 商品名称
     * @param price     成交价格
     */
    public void sendMarqueeMessage(String nickname, String goodsName, BigDecimal price) {
        MarqueeMessage mm = new MarqueeMessage(nickname, goodsName, price);
        sendMessage(mm);
        log.info("send marquee message[{}][{}][{}] to all", nickname, goodsName, price);
    }

    /**
     * 给客户端推送拍卖开始
     * @param auctionId 拍卖id
     * @param endTime 拍卖预计结束时间
     */
    public void sendStartAuctionMessage(long auctionId, Date endTime) {
        StartAuctionMessage message = new StartAuctionMessage(auctionId, endTime);
        sendMessage(message, auctionId);
        log.info("send start auction message. auctionId:{}, endTime:{}", auctionId,
                DateFormatUtils.format(endTime, "yyyy-MM-dd HH:mm:ss"));
    }

    /**
     * 推送拍卖响应给客户端
     * @param auctionInfo 拍卖信息
     */
    public void sendAuctionMessage(AuctionInfo auctionInfo) {
        AuctionMessage auctionMessage = new AuctionMessage(ErrorCode.SUCCESS, auctionInfo.getId(), auctionInfo.getEndTime(), auctionInfo.getCurrentPrice(), auctionInfo.getCurrentUserId(), auctionInfo.getNickname()
                , auctionInfo.getHeadImg(), auctionInfo.getVipLevel(), auctionInfo.getAuctionStatus(),
                null, null);
        sendMessage(auctionMessage, auctionInfo.getId());
        log.info("send auction push message. auctionId:{}, endTime:{}, currentPrice:{}, currentUserId:{}",
                auctionInfo.getId(), DateFormatUtils.format(auctionInfo.getEndTime(), "yyyy-MM-dd HH:mm:ss"),
                auctionInfo.getCurrentPrice(), auctionInfo.getCurrentUserId());
    }

    /**
     * 推送拍卖成交响应给客户端
     * @param auctionId 拍卖id
     * @param endTime 拍卖预计结束时间
     * @param currentPrice 当前价格
     * @param currentUserId 当前出价人
     * @param nickname 当前出价人昵称
     * @param headImg 当前出价人头像
     * @param nextAuctionId 下一期拍卖ID
     */
    public void sendSuccessAuctionPushMessage(long auctionId, Date endTime, BigDecimal currentPrice, long currentUserId,
                                              String nickname, String headImg, Integer vipLevel,
                                              Long nextAuctionId, Boolean smallUser) {
        AuctionMessage message = new AuctionMessage(ErrorCode.SUCCESS, auctionId, endTime, currentPrice, currentUserId,
                nickname, headImg, vipLevel, AuctionStatus.SUCCESS, nextAuctionId, smallUser);
        sendMessage(message, auctionId);
        log.info("send success auction push message. auctionId:{}, endTime:{}, currentPrice:{}, currentUserId:{}, smallUser:{}",
                auctionId, DateFormatUtils.format(endTime, "yyyy-MM-dd HH:mm:ss"), currentPrice,
                currentUserId, smallUser);
    }

    /**
     * 推送流拍响应给客户端
     * @param auctionId 拍卖id
     * @param endTime 拍卖结束时间
     */
    public void sendFailedAuctionPushMessage(long auctionId, Date endTime, Long nextAuctionId) {
        AuctionMessage message = new AuctionMessage(ErrorCode.SUCCESS, auctionId, endTime, null, null,
                null,null, null, AuctionStatus.FAILED, nextAuctionId,
                null);
        sendMessage(message, auctionId);
        log.info("send failed auction push message. auctionId:{}, endTime:{}", auctionId,
                DateFormatUtils.format(endTime, "yyyy-MM-dd HH:mm:ss"));
    }

    /***
     * 发送活动元素收集推送
     * @param activityId 活动id
     * @param num 活动元素
     * @param lastNum 用户集齐活动元素数量
     * @param lastAwardNum 奖励数量
     * @param userId 用户id
     */
    public void sendActivityMessage(long activityId, long num, long lastNum, long lastAwardNum, long userId) {
        ActivityMessage activityMessage = new ActivityMessage(ErrorCode.SUCCESS, activityId, num, lastNum, lastAwardNum);
        sendMessage(activityMessage, null, userId);
        log.info("send activity message success.activityId[{}] num[{}] lastNum[{}] lastAwardNum[{}] to user[{}]", activityId, num, lastNum, lastAwardNum, userId);
    }

    /**
     * 推送用户账户余额给客户端
     * @param userId 用户id
     * @param balance 账户余额
     */
    public void sendUserAccountBalanceMessage(long userId, long balance) {
        UserAccountBalanceMessage message = new UserAccountBalanceMessage(balance);
        sendMessage(message, null, userId);
        log.info("send user account balance[{}] to client[{}]", balance, userId);
    }

    /**
     * 推送拍卖实时信息响应给客户端
     *
     * @param auctionId        拍卖id
     * @param onlookerCount    围观人次
     * @param auctionUserCount 出价人数
     */
    public void sendAuctionRealtimeInfoMessage(long auctionId, Integer onlookerCount, Integer auctionUserCount) {
        AuctionRealtimeInfoMessage auctionRealtimeInfoMessage = new AuctionRealtimeInfoMessage(auctionId, onlookerCount, auctionUserCount);
        sendMessage(auctionRealtimeInfoMessage, auctionId);
        log.info("send auction real time info message [{}][{}][{}]", auctionId, onlookerCount, auctionUserCount);
    }

    /**
     * 推送用户暗拍场出价(调整价格)响应给客户端
     *
     * @param auctionId 拍卖id
     * @param nickname  用户昵称
     * @param first     是否首次出价
     */
    public void sendSealedUserAuctionMessage(long auctionId, String nickname, boolean first) {
        SealedUserAuctionMessage sealedUserAuctionMessage = new SealedUserAuctionMessage(auctionId, nickname, first);
        sendMessage(sealedUserAuctionMessage, auctionId);
        log.info("send sealed user[{}][{}] auction[{}] message", nickname, first, auctionId);
    }

    /***
     *	推送托管成功出价的响应
     * @param auctionId
     * @param currentAuctionTimes
     * @param auctionPeriod
     * @param auctionFeeLimit
     * @param userId
     */
    public void sendDepositAuctionSuccessMessage(long auctionId, int currentAuctionTimes, int auctionPeriod, long auctionFeeLimit, long userId) {
        DepositAuctionMessage depositAuctionMessage = new DepositAuctionMessage(ErrorCode.SUCCESS, auctionId, currentAuctionTimes, auctionPeriod, auctionFeeLimit);
        sendMessage(depositAuctionMessage, null, userId);
        log.info("send deposit message success. auctionId[{}] currentAuctionTimes[{}] auctionPeriod[{}] auctionFeeLimit[{}] to user[{}]", auctionId, currentAuctionTimes, auctionPeriod, auctionFeeLimit, userId);
    }
}
