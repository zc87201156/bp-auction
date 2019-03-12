package com.bp.auction.server.controller;

import com.bp.auction.common.constants.*;
import com.bp.auction.common.dal.entity.AuctionHistory;
import com.bp.auction.common.dal.entity.Banner;
import com.bp.auction.common.dal.entity.ViolationUser;
import com.bp.auction.common.service.bo.DepositUserInfo;
import com.bp.auction.server.controller.request.AuctionInfoChangeRequest;
import com.bp.auction.server.controller.request.AuctionRequest;
import com.bp.auction.server.controller.request.DepositRequest;
import com.bp.auction.server.controller.request.GoodsRequest;
import com.bp.auction.server.controller.response.*;
import com.bp.auction.server.service.*;
import com.bp.auction.server.service.bo.AuctionInfo;
import com.bp.auction.server.service.bo.SealedAuctionInfo;
import com.bp.core.response.ResponseBean;
import com.bp.core.utils.exception.BusinessCommonException;
import com.bp.core.web.base.BaseController;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import java.util.*;

/**
 * 拍卖
 *
 * @author zwf
 */
@Slf4j
@RestController
@RequestMapping("/auction/api/auction")
public class AuctionController extends BaseController {

    @Autowired
    private AuctionService auctionService;

    @Autowired
    private AuctionAttributeService auctionAttributeService;

    @Autowired
    private BannerService bannerService;

    @Autowired
    private UserService userService;

    @Autowired
    private DepositService depositService;

    @Autowired
    private AuctionUserService auctionUserService;

    @Autowired
    private AuctionHistoryService auctionHistoryService;

    @Autowired
    private FreeAuctionFeeService freeAuctionFeeService;

    @Autowired
    private SealedAuctionService sealedAuctionService;

    @Autowired
    private ViolationUserService violationUserService;

    @Autowired
    private WebSocketService webSocketService;

    @Autowired
    private ConfigService configService;

    /**
     * 拍卖大厅列表
     *
     * @return
     */
    @RequestMapping("/list")
    public ResponseBean getAuctionListInHall() {
        Long userId = getUserId();
        List<Long> idList = new LinkedList<>();

        boolean smallUser = userService.isSmallUser(userId);
        //如果是小户，则查询小户场id列表
        if (smallUser) {
            idList.addAll(auctionService.findIdListInHall(AuctionClass.SMALL_USER));
        }
        //免手续费场id列表
        idList.addAll(auctionService.findIdListInHall(AuctionClass.FREE_AUCTION_FEE));
        //暗拍场id列表
        idList.addAll(auctionService.findIdListInHall(AuctionClass.SEALED));
        //普通场id列表
        idList.addAll(auctionService.findIdListInHall(AuctionClass.COMMON));

        //当前时间之后XX分钟内开始的滚拍
        int minutes = configService.getAdvanceDisplayRollAuctionMinutes();
        if (minutes <= 0) {
            minutes = 30;//默认显示30分钟内要开始的滚拍
        }

        //显示开始时间早于此时间的滚拍
        long displayTime = System.currentTimeMillis() + minutes * 60 * 1000L;

        List<SimpleAuctionInfo> hallList = new ArrayList<>(idList.size());
        for (Iterator<Long> it = idList.iterator(); it.hasNext();) {
            AuctionInfo auctionInfo = auctionService.getAuctionInfoById(it.next());
            if (auctionInfo != null) {
                AuctionType auctionType = auctionInfo.getType();
                //只显示手动配置的和进行中的和当前时间之后一段时间内开始的滚拍
                if (auctionType == AuctionType.MANUAL || auctionInfo.getStartTime().getTime() <= displayTime) {
                    Integer auctionUserCount;
                    //暗拍场和其他场次出价人数获取方式不一样
                    if (auctionInfo.getAuctionClass() == AuctionClass.SEALED) {
                        auctionUserCount = sealedAuctionService.getAuctionedUserCount(auctionInfo.getId(),
                                auctionInfo.getAuctionStatus());
                    } else {
                        auctionUserCount = auctionAttributeService.getAuctionedUserCount(auctionInfo.getId(),
                                auctionInfo.getAuctionStatus());
                    }
                    hallList.add(new SimpleAuctionInfo(auctionInfo, auctionUserCount));
                }
            }
        }

        //取banner图列表
        List<Banner> banners = bannerService.listBanners();

        //获取自己已拍中未支付的商品数量
        long winAuctionNum = auctionService.getUserWinAuctionNum(userId);

        Map<String, Object> result = new HashMap<>(4);
        result.put("hall", hallList);
        result.put("banner", banners);
        result.put("winAuctionNum", winAuctionNum);
        result.put("sendTime", System.currentTimeMillis());//返回下当前服务器时间戳
        return responseSuccess(result);
    }

    /**
     * 拍卖信息接口
     *
     * @return
     */
    @RequestMapping("/info")
    public ResponseBean info(@RequestBody @Valid AuctionRequest request) {
        Long userId = getUserId();
        Long auctionId = request.getAuctionId();

        AuctionInfo auctionInfo = auctionService.getAuctionInfoById(auctionId);
        if (auctionInfo == null) {
            return responseError(ErrorCode.AUCTION_INFO_NOT_EXISTS);
        }

        AuctionStatus status = auctionInfo.getAuctionStatus();
        int onlookerCount = auctionAttributeService.getOnlookerCount(auctionId, status);

        int auctionUserCount;
        AuctionClass auctionClass = auctionInfo.getAuctionClass();
        //暗拍场获取出价人数方式不一样
        if (auctionClass == AuctionClass.SEALED) {
            auctionUserCount = sealedAuctionService.getAuctionedUserCount(auctionId, status);
        } else {
            auctionUserCount = auctionAttributeService.getAuctionedUserCount(auctionId, status);
        }

        //获取本期自己设置的托管信息
        DepositUserInfo depositUserInfo = depositService.getUserDepositInfo(auctionId, userId);

        //获取自己已拍中未支付的商品数量
        long winAuctionNum = auctionService.getUserWinAuctionNum(userId);

        //查询是否是小户
        boolean smallUser = userService.isSmallUser(userId);

        Map<String, Object> result = new HashMap<>();

        //是否需要查询违约信息的标志
        boolean showViolationInfo = false;

        //如果是免手续费场
        if (auctionClass == AuctionClass.FREE_AUCTION_FEE) {
            boolean isEnroll = freeAuctionFeeService.isEnrollUser(auctionId, userId);
            result.put("isEnroll", isEnroll);

            //如果用户未报名免该手续费场，则须查询是否是违约用户
            if (!isEnroll) {
                showViolationInfo = true;
            }
        }
        //如果是暗拍场
        if (auctionClass == AuctionClass.SEALED) {
            //是否出价
            boolean isAuction = sealedAuctionService.isAuction(auctionId, userId);
            result.put("isAuction", isAuction);

            //客户端须提前锁定用户出价的秒数
            int settlingSeconds = configService.getSealedAuctionSettlingSeconds();
            result.put("settlingSeconds", settlingSeconds);

            //如果用户未出价，则须查询是否是违约用户
            if (!isAuction) {
                showViolationInfo = true;
            } else {
                //如果用户已出过价，则查询用户离开期间的出价人数
                int latestAuctionedUserCount = sealedAuctionService.getLatestAuctionedUserCount(auctionId, userId);
                result.put("latestAuctionedUserCount", latestAuctionedUserCount);
                //如果已出价则查询用户自己的出价信息
                SealedAuctionInfo sai = sealedAuctionService.getSealedAuctionInfo(auctionId, userId);
                if (sai != null) {
                    result.put("myAuctionPrice", sai.getPrice());
                }
            }
            //用户进入该暗拍场
            sealedAuctionService.enter(auctionId, userId);
        }

        //如果需要查询违约信息
        if (showViolationInfo) {
            ViolationUser vu = violationUserService.getByUserId(userId);
            boolean isViolationUser = violationUserService.isViolationUser(vu);

            result.put("isViolationUser", isViolationUser);
            //如果是违约用户，则给出具体的违约信息
            if (isViolationUser) {
                result.put("violationTime", vu.getViolationTime());
                result.put("violationGoodsName", vu.getGoodsName());
                result.put("bailAmount", vu.getBailAmount());
            }
        }

        result.put("auctionInfo", new AuctionInfoRsp(auctionInfo));
        result.put("onlookerCount", onlookerCount);
        result.put("auctionUserCount", auctionUserCount);
        result.put("depositUserInfo", depositUserInfo);
        result.put("winAuctionNum", winAuctionNum);
        result.put("smallUser", smallUser);
        result.put("sendTime", System.currentTimeMillis());//返回当前服务器时间戳
        return responseSuccess(result);
    }

    /**
     * 出价请求
     * @param request
     * @return
     */
    @RequestMapping("/auction")
    public ResponseBean auction(@RequestBody @Valid AuctionRequest request) {
        Long userId = getUserId();
        Long channelId = getChannelId();
        Long auctionId = request.getAuctionId();

        try {
            auctionService.auction(auctionId, userId, channelId, OperateType.MANUAL);
            return responseSuccess();
        } catch (BusinessCommonException e) {
            return responseError(e.getCode(), e.getMsg());
        }
    }

    /**
     * 拍卖出价记录查询
     *
     * @param request
     * @return
     */
    @RequestMapping("/history")
    public ResponseBean history(@RequestBody @Valid AuctionRequest request) {
        Collection<AuctionHistory> list = auctionHistoryService.getByAuctionId(request.getAuctionId());
        return responseSuccess(list);
    }

    /**
     * 商品往期成交
     *
     * @param request
     * @return
     */
    @RequestMapping("/recent")
    public ResponseBean recent(@RequestBody @Valid GoodsRequest request) {
        List<RecentAuctionRsp> list = auctionService.findRecentSuccessAuctions(request.getGoodsId());
        return responseSuccess(list);
    }

    /**
     * 我正在拍的拍卖
     *
     * @return
     */
    @RequestMapping("/my/auctioning")
    public ResponseBean<List<MyAuctionInfoRsp>> myAuctioning() {
        long userId = getUserId();
        List<MyAuctionInfoRsp> list = auctionUserService.findAuctioningInfoByUserId(userId);
        return responseSuccess(list);
    }

    /**
     * 我拍中的拍卖
     *
     * @return
     */
    @RequestMapping("/my/successAuction")
    public ResponseBean<List<MyAuctionInfoRsp>> mySuccessAuction() {
        long userId = getUserId();
        List<MyAuctionInfoRsp> list = auctionUserService.findSuccessAuctionInfoByUserId(userId);
        return responseSuccess(list);
    }

    /**
     * 我未拍中的拍卖
     *
     * @return
     */
    @RequestMapping("/my/failedAuction")
    public ResponseBean<List<MyAuctionInfoRsp>> myFailedAuction() {
        long userId = getUserId();
        List<MyAuctionInfoRsp> list = auctionUserService.findFailedAuctionInfoByUserId(userId);
        return responseSuccess(list);
    }

    /***
     * 设置和取消托管请求
     * @param depositRequest
     * @return
     */
    @RequestMapping("/userDeposit")
    public Object userDeposit(@Valid @RequestBody DepositRequest depositRequest) {
        long auctionId = depositRequest.getAuctionId();
        long userId = getUserId();
        long channelId = getChannelId();
        AuctionInfo auctionInfo = auctionService.getAuctionInfoById(auctionId);
        if (auctionInfo == null) {
            return responseError(ErrorCode.AUCTION_INFO_NOT_EXISTS, "托管信息不存在");
        }
        if (auctionInfo.getAuctionStatus() == AuctionStatus.SUCCESS || auctionInfo.getAuctionStatus() == AuctionStatus.FAILED) {
            return responseError(ErrorCode.CAN_NOT_DEPOSIT_THIS_STATUS, "结束状态下不能进行托管操作");
        }
        //校验场次是否支持托管
        if (auctionInfo.getCanDeposit() != YesOrNo.YES) {
            return responseError(ErrorCode.CAN_NOT_DEPOSIT_THIS_STATUS, "本场次不支持托管");
        }
        boolean cancel = depositRequest.isCancel();
        //取消托管
        if (cancel) {
            depositService.cancelUserDeposit(auctionId, userId, false, "用户主动取消");
        } else {
            int isAutoNext = depositRequest.getIsAutoNext();
            int auctionPeriod = depositRequest.getAuctionPeriod();
            long auctionLimit = depositRequest.getAuctionLimit();
            if (auctionPeriod <= 0 || auctionPeriod >= 10) {
                return responseError(ErrorCode.REQUEST_PARAM_ERROR, "参数有错误");
            }
            if (auctionLimit <= 0) {
                return responseError(ErrorCode.REQUEST_PARAM_ERROR, "参数有错误");
            }
            long amount = userService.getAccountBalance(userId);
            if (amount <= 0) {
                return responseError(ErrorCode.USER_BALANCE_NOT_ENOUGH, "余额不足，无法托管");
            }

            String city = depositRequest.getCity();
            long extraDelay = 0;
            switch (auctionInfo.getAuctionStatus()) {
                //未开始
                case NO_AUCTION:
                    extraDelay = System.currentTimeMillis() - auctionInfo.getStartTime().getTime() <= 0 ? 0 : System.currentTimeMillis() - auctionInfo.getStartTime().getTime();
                    depositService.setUserDeposit(auctionId, userId, isAutoNext, auctionPeriod, auctionLimit, channelId, city, false, extraDelay);
                    break;
                //进行中
                case AUCTIONING:
                    depositService.setUserDeposit(auctionId, userId, isAutoNext, auctionPeriod, auctionLimit, channelId, city, true, extraDelay);
                    break;
            }

        }
        DepositRsp depositRsp = new DepositRsp(auctionId, cancel);
        return responseSuccess(depositRsp);
    }

    /**
     * 订阅、取消订阅拍卖信息变化
     * @param request
     * @return
     */
    @RequestMapping("/auctionInfoChange")
    public ResponseBean auctionInfoChange(@RequestBody @Valid AuctionInfoChangeRequest request) {
        Long userId = getUserId();
        Long auctionId = request.getAuctionId();
        Boolean push = request.getPush();

        AuctionInfo auctionInfo = auctionService.getAuctionInfoById(auctionId);
        if (auctionInfo == null) {
            return responseError(ErrorCode.AUCTION_INFO_NOT_EXISTS);
        }

        AuctionStatus status = auctionInfo.getAuctionStatus();
        if (push) {
            //订阅拍卖信息变化
            auctionService.addAuctionInfoChangeUserId(userId, auctionId);
            //设置用户当前所在的拍卖场次
            userService.setCurrentAuctionId(userId, auctionId);

            //拍卖未开始或进行中时更新围观人次
            if (status == AuctionStatus.NO_AUCTION || status == AuctionStatus.AUCTIONING) {
                //该拍卖围观人次+1
                int onlookerCount = auctionAttributeService.incrByOnlookerCount(auctionId);
                //推送围观人次给已订阅的客户端
                webSocketService.sendAuctionRealtimeInfoMessage(auctionId, onlookerCount, null);
            }
        } else {
            //取消订阅拍卖信息变化
            auctionService.removeAuctionInfoChangeUserId(userId, auctionId);
            //移除用户当前所在的拍卖场次
            userService.setCurrentAuctionId(userId, null);
            //如果是正在进行中的暗拍场
            if (auctionInfo.getAuctionClass() == AuctionClass.SEALED && status == AuctionStatus.AUCTIONING) {
                //用户离开暗拍场
                sealedAuctionService.left(auctionId, userId);
            }
        }
        return responseSuccess();
    }
}
