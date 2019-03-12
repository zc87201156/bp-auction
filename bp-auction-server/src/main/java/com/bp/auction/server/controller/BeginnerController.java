package com.bp.auction.server.controller;

import com.bp.auction.common.constants.*;
import com.bp.auction.common.dal.entity.Beginner;
import com.bp.auction.common.dal.entity.BeginnerAuction;
import com.bp.auction.common.dal.entity.BeginnerGoods;
import com.bp.auction.common.dal.entity.RollAuction;
import com.bp.auction.common.service.bo.DepositUserInfo;
import com.bp.auction.server.controller.request.AuctionRequest;
import com.bp.auction.server.controller.response.AuctionInfoRsp;
import com.bp.auction.server.controller.response.BeginnerGoodsRsp;
import com.bp.auction.server.controller.response.SimpleAuctionInfo;
import com.bp.auction.server.service.*;
import com.bp.auction.server.service.bo.AuctionInfo;
import com.bp.core.response.ResponseBean;
import com.bp.core.web.base.BaseController;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 新小户 新手引导相关接口
 * @author zwf
 */
@Slf4j
@RestController
@RequestMapping("/auction/api/beginner")
public class BeginnerController extends BaseController {

	@Autowired
	private BeginnerService beginnerService;

	@Autowired
	private RollAuctionService rollAuctionService;

	@Autowired
	private AuctionService auctionService;

	@Autowired
	private AuctionAttributeService auctionAttributeService;

	@Autowired
	private DepositService depositService;

	@Autowired
	private BeginnerAuctionService beginnerAuctionService;

	@Autowired
	private UserService userService;

	@Autowired
	private PlatformService platformService;

	@Autowired
	private BeginnerGoodsService beginnerGoodsService;

	/**
	 * 是否新小户接口
	 *
	 * @return
	 */
	@RequestMapping("/is")
	public ResponseBean beginner() {
		Long userId = getUserId();

		Beginner beginner = beginnerService.getByUserId(userId);
		boolean isBeginner = beginnerService.isBeginner(beginner);

		Map<String, Object> result = new HashMap<>();

		//如果不是新小户
		if (!isBeginner) {
			result.put("isBeginner", false);
			return responseSuccess(result);
		}

		//查询新小户滚拍配置
		List<RollAuction> rollAuctions = rollAuctionService.findByType(RollAuctionType.BEGINNER);
		//如果新小户滚拍未配置
		if (rollAuctions.isEmpty()) {
			return responseError(ErrorCode.BEGINNER_ROLL_AUCTION_NOT_EXISTS);
		}

		//目前新手场就一个
		RollAuction rollAuction = rollAuctions.get(0);
		Long currentAuctionId = rollAuction.getCurrentAuctionId();
		if (currentAuctionId == null) {
			return responseError(ErrorCode.AUCTION_INFO_NOT_EXISTS);
		}

		AuctionInfo auctionInfo = auctionService.getAuctionInfoById(currentAuctionId);
		//如果拍卖信息不存在
		if (auctionInfo == null) {
			return responseError(ErrorCode.AUCTION_INFO_NOT_EXISTS);
		}
		//是否首次出价
		boolean first = beginnerService.isFirstAuction(beginner);

		result.put("isBeginner", true);
		result.put("auctionInfo", new SimpleAuctionInfo(auctionInfo));
		result.put("firstAuction", first);
		result.put("auctionFee", auctionInfo.getAuctionFee());
		result.put("auctionFeePrice", auctionInfo.getAuctionFeePrice());
		result.put("sendTime", System.currentTimeMillis());
		return responseSuccess(result);
	}

	/**
	 * 新手引导的拍卖信息接口
	 *
	 * @return
	 */
	@RequestMapping("/info")
	public ResponseBean beginnerInfo(@RequestBody @Valid AuctionRequest request) {
		Long userId = getUserId();
		Long auctionId = request.getAuctionId();

		AuctionInfo auctionInfo = auctionService.getAuctionInfoById(auctionId);
		if (auctionInfo == null) {
			return responseError(ErrorCode.AUCTION_INFO_NOT_EXISTS);
		}

		AuctionStatus status = auctionInfo.getAuctionStatus();
		int onlookerCount = auctionAttributeService.getOnlookerCount(auctionId, status);
		int auctionUserCount = auctionAttributeService.getAuctionedUserCount(auctionId, status);

		//获取本期自己设置的托管信息
		DepositUserInfo depositUserInfo = depositService.getUserDepositInfo(auctionId, userId);

		//获取自己已拍中未支付的商品数量
		long winAuctionNum = auctionService.getUserWinAuctionNum(userId);

		Beginner beginner = beginnerService.getByUserId(userId);
		//是否首次出价
		boolean first = beginnerService.isFirstAuction(beginner);

		Map<String, Object> result = new HashMap<>();
		result.put("auctionInfo", new AuctionInfoRsp(auctionInfo));
		result.put("onlookerCount", onlookerCount);
		result.put("auctionUserCount", auctionUserCount);
		result.put("depositUserInfo", depositUserInfo);
		result.put("winAuctionNum", winAuctionNum);
		result.put("firstAuction", first);
		result.put("sendTime", System.currentTimeMillis());//返回下当前服务器时间戳
		return responseSuccess(result);
	}

	/**
	 * 检测当前用户是否是新用户(新手引导)
	 *
	 * @return
	 */
	@RequestMapping("/user/check")
	public ResponseBean<Map<String, Object>> checkBeginnerUser() {
		Long userId = getUserId();
		Beginner beginner = beginnerService.getByUserId(userId);
		boolean firstAuction = beginnerService.isFirstAuction(beginner);

		Map<String, Object> result = new HashMap<>();
		result.put("beginnerUser", firstAuction);

		//如果是新用户则查询新手商品信息
		if (firstAuction) {
			BeginnerGoods bg = beginnerGoodsService.getDefault();
			if (bg != null) {
				result.put("goods", new BeginnerGoodsRsp(bg));
			}
		}
		return responseSuccess(result);
	}

	/**
	 * 新用户出价(新手引导)
	 *
	 * @return
	 */
	@RequestMapping("/user/auction")
	public ResponseBean beginnerUserAuction() {
		Long userId = getUserId();
		long channelId = getChannelId();
		boolean lock = beginnerAuctionService.lock(userId);
		//防止恶意并发请求
		if (!lock) {
			return responseError(ErrorCode.OPERATION_TOO_FREQUENT);
		}

		BeginnerAuction ba = beginnerAuctionService.getByUserId(userId);
		//判断该用户是否已完成新手拍卖
		if (ba != null) {
			beginnerAuctionService.unlock(userId);
			return responseError(ErrorCode.NOT_BEGINNER_USER);
		}
		//查找新手拍卖商品
		BeginnerGoods bg = beginnerGoodsService.getDefault();
		if (bg == null) {
			beginnerAuctionService.unlock(userId);
			return responseError(ErrorCode.BEGINNER_GOODS_NOT_EXISTS);
		}

		//插入一条新手拍卖记录并发货。
		ba = beginnerAuctionService.insertBeginnerAuction(userId, bg);

		//用户第二次出价需要扣除手续费
		int code = userService.updateUserCoin(userId, channelId, bg.getAuctionFee(),
				BusinessType.BEGINNER_AUCTION_FEE, ba.getId());
		if (code != ErrorCode.SUCCESS) {
			beginnerAuctionService.unlock(userId);
			return responseError(code);
		}

		Beginner beginner = beginnerService.getByUserId(userId);
		//更新用户首次出价时间
		beginnerService.updateFirstAuctionTime(beginner, System.currentTimeMillis());

		Long parentChannelId = getParentChannelId();
		//给用户发货
		boolean b = platformService.sendAwards(ba.getId(), bg.getPlatProductId(), userId, channelId, parentChannelId,
				AuctionConstants.BEGINNER_DELIVERY_NOTIFY_MQ);
		if (!b) {
			beginnerAuctionService.unlock(userId);
			log.error("send beginner user awards failed. userId:{}, channelId:{}, parentChannelId:{}, beginnerAuctionId:{}",
					userId, channelId, parentChannelId, ba.getId());
			return responseError(ErrorCode.SEND_PLATFORM_AWARDS_FAILED);
		}

		beginnerAuctionService.unlock(userId);
		return responseSuccess();
	}
}
