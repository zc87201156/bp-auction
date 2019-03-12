package com.bp.auction.server.controller;

import com.bp.auction.common.constants.*;
import com.bp.auction.common.dal.entity.AuctionHistory;
import com.bp.auction.common.dal.entity.ViolationUser;
import com.bp.auction.server.controller.request.AuctionRequest;
import com.bp.auction.server.service.*;
import com.bp.auction.server.service.bo.AuctionInfo;
import com.bp.core.response.ResponseBean;
import com.bp.core.web.base.BaseController;
import com.bp.platform.rpc.dto.UserDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import java.math.BigDecimal;
import java.util.Date;

/**
 * 免手续费
 * @author zwf
 */
@RestController
@RequestMapping("/auction/api/free")
public class FreeAuctionFeeController extends BaseController {

	@Autowired
	private FreeAuctionFeeService freeAuctionFeeService;

	@Autowired
	private ViolationUserService violationUserService;

	@Autowired
	private AuctionService auctionService;

	@Autowired
	private UserService userService;

	@Autowired
	private AuctionHistoryService auctionHistoryService;

	/**
	 * 免手续费场报名
	 *
	 * @param request
	 * @return
	 */
	@RequestMapping("/enroll")
	public ResponseBean enroll(@RequestBody @Valid AuctionRequest request) {
		Long userId = getUserId();
		Long channelId = getChannelId();

		boolean lock = freeAuctionFeeService.lockEnroll(userId);
		//防止恶意并发请求
		if (!lock) {
			return responseError(ErrorCode.OPERATION_TOO_FREQUENT);
		}

		Long auctionId = request.getAuctionId();
		boolean isEnroll = freeAuctionFeeService.isEnrollUser(auctionId, userId);
		//用户已报名
		if (isEnroll) {
			freeAuctionFeeService.unlockEnroll(userId);
			return responseError(ErrorCode.ALREADY_ENROLL_FREE_AUCTION_FEE);
		}

		boolean isViolationUser = violationUserService.isViolationUser(userId);
		//违约用户不能报名
		if (isViolationUser) {
			freeAuctionFeeService.unlockEnroll(userId);
			return responseError(ErrorCode.VIOLATED_USER);
		}

		AuctionInfo auctionInfo = auctionService.getAuctionInfoById(auctionId);
		if (auctionInfo == null) {
			freeAuctionFeeService.unlockEnroll(userId);
			return responseError(ErrorCode.AUCTION_INFO_NOT_EXISTS);
		}

		AuctionStatus auctionStatus = auctionInfo.getAuctionStatus();
		//拍卖成交或流拍时不允许报名(不做精确控制)
		if (auctionStatus == AuctionStatus.SUCCESS || auctionStatus == AuctionStatus.FAILED) {
			freeAuctionFeeService.unlockEnroll(userId);
			return responseError(ErrorCode.AUCTION_IS_OVER);
		}

		//校验是否是免手续费场
		if (auctionInfo.getAuctionClass() != AuctionClass.FREE_AUCTION_FEE) {
			freeAuctionFeeService.unlockEnroll(userId);
			return responseError(ErrorCode.NOT_FREE_AUCTION_FEE_AUCTION);
		}

		Long entryFee = auctionInfo.getFreeEntryFee();
		//校验报名费
		if (entryFee == null || entryFee <= 0L) {
			freeAuctionFeeService.unlockEnroll(userId);
			return responseError(ErrorCode.ILLEGAL_FREE_ENTRY_FEE);
		}

		//获取用户信息
		UserDto user = userService.getByUserId(userId);
		if (user == null) {
			freeAuctionFeeService.unlockEnroll(userId);
			return responseError(ErrorCode.USER_NOT_EXIST);
		}

		Integer vipLevel = userService.getVipLevelByUserId(userId);

		AuctionHistory history = new AuctionHistory();
		history.setAuctionId(auctionId);
		history.setUserId(userId);
		history.setNickname(user.getNickname());
		history.setHeadImg(user.getHeadImg());
		history.setVipLevel(vipLevel);
		history.setAuctionFee(entryFee);
		history.setBeforePrice(new BigDecimal(0.0D));
		history.setAfterPrice(new BigDecimal(0.0D));
		history.setCreateTime(new Date());
		history.setOperateType(OperateType.MANUAL.getValue());
		//保存用户报名记录
		auctionHistoryService.save(history);

		int code = userService.updateUserCoin(userId, channelId, entryFee, BusinessType.AUCTION_FEE, history.getId());
		//扣除入场费失败
		if (code != ErrorCode.SUCCESS) {
			freeAuctionFeeService.unlockEnroll(userId);
			return responseError(code);
		}

		//用户报名
		freeAuctionFeeService.enroll(auctionId, userId);

		//解锁
		freeAuctionFeeService.unlockEnroll(userId);
		return responseSuccess();
	}

	/**
	 * 违约用户交保证金
	 *
	 * @return
	 */
	@RequestMapping("/payBailFee")
	public ResponseBean payBailFee() {
		Long userId = getUserId();
		Long channelId = getChannelId();
		boolean lock = freeAuctionFeeService.lockPayBailFee(userId);
		//防止恶意并发请求
		if (!lock) {
			return responseError(ErrorCode.OPERATION_TOO_FREQUENT);
		}
		ViolationUser vu = violationUserService.getByUserId(userId);
		boolean isViolationUser = violationUserService.isViolationUser(vu);
		//校验是否是违约用户
		if (!isViolationUser) {
			freeAuctionFeeService.unlockPayBailFee(userId);
			return responseError(ErrorCode.NOT_VIOLATED_USER);
		}
		//支付保证金
		int code = freeAuctionFeeService.payBailFee(userId, channelId, vu.getBailAmount());
		if (code != ErrorCode.SUCCESS) {
			freeAuctionFeeService.unlockPayBailFee(userId);
			return responseError(code);
		}
		//解锁
		freeAuctionFeeService.unlockPayBailFee(userId);
		return responseSuccess();
	}
}
