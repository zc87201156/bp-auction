package com.bp.auction.server.controller;

import com.bp.auction.common.constants.*;
import com.bp.auction.common.dal.entity.Beginner;
import com.bp.auction.common.dal.entity.SealedAuctionRanking;
import com.bp.auction.server.controller.request.AuctionRequest;
import com.bp.auction.server.controller.request.SealedAuctionRankingListRequest;
import com.bp.auction.server.controller.request.SealedAuctionRequest;
import com.bp.auction.server.service.*;
import com.bp.auction.server.service.bo.AuctionInfo;
import com.bp.auction.server.service.bo.SealedAuctionRankingInfo;
import com.bp.core.response.ResponseBean;
import com.bp.core.web.base.BaseController;
import com.bp.platform.rpc.dto.UserDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 暗拍场
 */
@RestController
@RequestMapping("/auction/api/sealed")
public class SealedAuctionController extends BaseController {

    @Autowired
    private AuctionService auctionService;

    @Autowired
    private BeginnerService beginnerService;

    @Autowired
    private ConfigService configService;

    @Autowired
    private AuctionHistoryService auctionHistoryService;

    @Autowired
    private ViolationUserService violationUserService;

    @Autowired
    private UserService userService;

    @Autowired
    private SealedAuctionService sealedAuctionService;

    @Autowired
    private WebSocketService webSocketService;

    @Autowired
    private ActivityService activityService;

    /**
     * 暗拍场我的最终定价排名
     *
     * @return
     */
    @RequestMapping("/my/ranking")
    public Object mySealedAuctionRanking(@RequestBody @Valid AuctionRequest request) {
        Long userId = getUserId();
        Long auctionId = request.getAuctionId();

        AuctionInfo auctionInfo = auctionService.getAuctionInfoById(auctionId);
        if (auctionInfo == null) {
            return responseError(ErrorCode.AUCTION_INFO_NOT_EXISTS);
        }
        //校验是否是暗拍场
        if (auctionInfo.getAuctionClass() != AuctionClass.SEALED) {
            return responseError(ErrorCode.NOT_SEALED_AUCTION);
        }
        //只能在暗拍场结束时才能查询定价排名，防止在未结束时被客户端误请求导致生成错误的缓存
        if (auctionInfo.getAuctionStatus() != AuctionStatus.SUCCESS) {
            return responseError(ErrorCode.AUCTION_NOT_SUCCESS);
        }

        boolean isAuction = sealedAuctionService.isAuction(auctionId, userId);
        //非出价用户(包括redis缓存过期)不查询定价排名
        if (!isAuction) {
            return responseError(ErrorCode.SEALED_AUCTION_USER_NO_RANKING);
        }

        //获取用户的排名
        SealedAuctionRanking sar = sealedAuctionService.getMyRanking(auctionId, userId);
        Map<String, Object> result = new HashMap<>(2);
        if (sar != null) {
            result.put("rank", sar.getRank());
            result.put("price", sar.getPrice());
        }
        return responseSuccess(result);
    }

    /**
     * 暗拍定价排名列表
     *
     * @param request
     * @return
     */
    @RequestMapping("/ranking/list")
    public ResponseBean sealedAuctionRankingList(@RequestBody @Valid SealedAuctionRankingListRequest request) {
        Long auctionId = request.getAuctionId();
        Integer page = request.getPage();

        AuctionInfo auctionInfo = auctionService.getAuctionInfoById(auctionId);
        if (auctionInfo == null) {
            return responseError(ErrorCode.AUCTION_INFO_NOT_EXISTS);
        }
        //校验是否是暗拍场
        if (auctionInfo.getAuctionClass() != AuctionClass.SEALED) {
            return responseError(ErrorCode.NOT_SEALED_AUCTION);
        }
        //只能在暗拍场结束时才能查询定价排名列表
        if (auctionInfo.getAuctionStatus() != AuctionStatus.SUCCESS) {
            return responseError(ErrorCode.AUCTION_NOT_SUCCESS);
        }
        List<SealedAuctionRankingInfo> result = sealedAuctionService.findByPage(auctionId, page);
        return responseSuccess(result);
    }

    /**
     * 暗拍场用户出价
     *
     * @return
     */
    @RequestMapping("/auction")
    public ResponseBean sealedAuction(@RequestBody @Valid SealedAuctionRequest request) {
        Long userId = getUserId();
        Long channelId = getChannelId();
        boolean lock = sealedAuctionService.lock(userId);
        //防止恶意并发请求
        if (!lock) {
            return responseError(ErrorCode.OPERATION_TOO_FREQUENT);
        }

        Long auctionId = request.getAuctionId();
        AuctionInfo auctionInfo = auctionService.getAuctionInfoById(auctionId);
        if (auctionInfo == null) {
            sealedAuctionService.unlock(userId);
            return responseError(ErrorCode.AUCTION_INFO_NOT_EXISTS);
        }

        //校验是否是暗拍场
        if (auctionInfo.getAuctionClass() != AuctionClass.SEALED) {
            sealedAuctionService.unlock(userId);
            return responseError(ErrorCode.NOT_SEALED_AUCTION);
        }

        AuctionStatus auctionStatus = auctionInfo.getAuctionStatus();
        //拍卖未开始不允许出价
        if (auctionStatus == AuctionStatus.NO_AUCTION) {
            sealedAuctionService.unlock(userId);
            return responseError(ErrorCode.AUCTION_HAS_NOT_STARTED);
        }
        //拍卖已结束不允许出价
        if (auctionStatus == AuctionStatus.SUCCESS || auctionStatus == AuctionStatus.FAILED) {
            sealedAuctionService.unlock(userId);
            return responseError(ErrorCode.AUCTION_IS_OVER);
        }

        Date endTime = auctionInfo.getEndTime();
        //校验暗拍场的拍卖结束时间，防止程序出错未正确生成拍卖结束时间
        if (endTime == null) {
            sealedAuctionService.unlock(userId);
            return responseError(ErrorCode.SEALED_AUCTION_END_TIME_MISSING);
        }

        //结算时间
        int settlingSeconds = configService.getSealedAuctionSettlingSeconds();
        //出价时间取当前服务器时间
        long auctionTime = System.currentTimeMillis();

        //暗拍提前X秒锁定用户出价，用于定价排名结算
        if (auctionTime + settlingSeconds * 1000L >= endTime.getTime()) {
            sealedAuctionService.unlock(userId);
            return responseError(ErrorCode.AUCTION_IS_OVER);
        }

        boolean isViolationUser = violationUserService.isViolationUser(userId);
        //违约用户不能出价
        if (isViolationUser) {
            sealedAuctionService.unlock(userId);
            return responseError(ErrorCode.VIOLATED_USER);
        }

        //获取用户信息
        UserDto user = userService.getByUserId(userId);
        if (user == null) {
            sealedAuctionService.unlock(userId);
            return responseError(ErrorCode.USER_NOT_EXIST);
        }

        Long fee = auctionInfo.getAuctionFee();
        Integer vipLevel = userService.getVipLevelByUserId(userId);
        String nickname = user.getNickname();
        String headImg = user.getHeadImg();

        long newAuctionHistoryId = auctionHistoryService.nextId();
        //异步保存用户出价记录
        auctionHistoryService.asyncSave(newAuctionHistoryId, userId, nickname, headImg, vipLevel, auctionId, fee,
                OperateType.MANUAL, auctionTime);

        int code = userService.updateUserCoin(userId, channelId, fee, BusinessType.AUCTION_FEE, newAuctionHistoryId);
        //扣除手续费失败
        if (code != ErrorCode.SUCCESS) {
            sealedAuctionService.unlock(userId);
            return responseError(code);
        }

        //用户是否出过价
        boolean first = !sealedAuctionService.isAuction(auctionId, userId);

        //用户在暗拍场出价
        sealedAuctionService.auction(auctionId, userId, nickname, headImg, vipLevel, request.getPrice());

        Beginner beginner = beginnerService.getByUserId(userId);
        //更新用户首次出价时间
        beginnerService.updateFirstAuctionTime(beginner, auctionTime);

        //给其他用户推送该用户出价信息
        webSocketService.sendSealedUserAuctionMessage(auctionId, nickname, first);

        //推送拍卖已出价人数给已订阅的客户端
        int count = sealedAuctionService.getAuctionedUserCount(auctionId, auctionStatus);
        webSocketService.sendAuctionRealtimeInfoMessage(auctionId, null, count);

        //出价集福
        activityService.dealActivity(userId, ActivityOperateType.AUCTION);
        //解锁出价
        sealedAuctionService.unlock(userId);
        return responseSuccess();
    }


}
