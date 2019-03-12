package com.bp.auction.server.controller;

import com.bp.auction.common.constants.AuctionConstants;
import com.bp.auction.common.constants.AuctionStatus;
import com.bp.auction.common.constants.PaymentStatus;
import com.bp.auction.common.dal.entity.Goods;
import com.bp.auction.server.controller.request.BuyRequest;
import com.bp.auction.server.handler.HttpApiHandler;
import com.bp.auction.server.service.AuctionService;
import com.bp.auction.server.service.GoodsService;
import com.bp.auction.server.service.bo.AuctionInfo;
import com.bp.core.utils.IPUtils;
import com.bp.core.utils.TraceIdUtils;
import com.bp.core.web.base.BaseController;
import com.bp.platform.rpc.dto.CreateOrderInfoDto;
import com.bp.platform.rpc.dto.OnlinePayVO;
import com.bp.platform.rpc.dto.ProductWelfareDto;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Date;

/**
 * 支付接口
 * @author zwf
 */
@Slf4j
@RestController
@RequestMapping("/auction/api/payment")
public class PaymentController extends BaseController {

	@Autowired
	private AuctionService auctionService;

	@Autowired
	private GoodsService goodsService;

	@Autowired
	private HttpApiHandler httpApiHandler;

	/**
	 * 创建订单。由收银台页面调用
	 * @param request
	 * @return
	 */
	@RequestMapping("/order/create")
	public Object createOrder(@RequestBody BuyRequest<Long> request) {
		Long auctionId = request.getValue();
		if (auctionId == null) {
			return responseError("拍卖id不可为空。");
		}
		Long userId = getUserId();
		AuctionInfo auctionInfo = auctionService.getAuctionInfoById(auctionId);
		if (auctionInfo == null) {
			return responseError("拍卖信息不存在。");
		}

		AuctionStatus auctionStatus = auctionInfo.getAuctionStatus();
		if (auctionStatus == AuctionStatus.NO_AUCTION) {
			return responseError("无法创建订单，该拍卖尚未开始。");
		}
		if (auctionStatus != AuctionStatus.SUCCESS) {
			return responseError("无法创建订单，该拍卖尚未结束或已流拍。");
		}
		if (!userId.equals(auctionInfo.getCurrentUserId())) {
			return responseError("无法创建订单，你不是拍卖成交者。");
		}

		if (auctionInfo.getPaymentStatus() == PaymentStatus.SUCCESS) {
			return responseError("无法创建订单，该拍卖已支付。");
		}

		Date paymentEndTime = auctionInfo.getPaymentEndTime();
		if (paymentEndTime != null && paymentEndTime.getTime() < System.currentTimeMillis()) {
			return responseError("无法创建订单，该拍卖已过支付截止时间。");
		}

		Goods goods = goodsService.get(auctionInfo.getGoodsId());
		if (goods == null) {
			return responseError("无法创建订单，商品不存在。");
		}
		if (goods.getPlatProductId() == null) {
			return responseError("无法创建订单，平台商品未配置。");
		}

		ProductWelfareDto productWelfare = httpApiHandler.getProductWelfare(goods.getPlatProductId());
		if (productWelfare == null) {
			return responseError("无法创建订单，获取平台商品失败。");
		}

		String traceId = TraceIdUtils.getTraceId();
		log.info("try to payment auction[{}], userId:{}, traceId:{}", auctionId, userId, traceId);

		CreateOrderInfoDto order = new CreateOrderInfoDto();
		order.setUserId(userId);
		order.setChannelId(getChannelId());
		order.setParentChannelId(getParentChannelId());
		order.setTraceId(traceId);
		order.setIp(IPUtils.getRemoteAddress());
		order.setVersion(getVersion());
		order.setPayType(request.getPayType());
		order.setAccount(request.getAccount());
		order.setConfigId(request.getValue());
		order.setSource(request.getSource());
		order.setProductType(productWelfare.getType());
		order.setProductId(productWelfare.getId());
		order.setProductCode(productWelfare.getCode());
		order.setProductName(productWelfare.getName());
		order.setRequestOrderId(auctionId + "");
		order.setGameId(AuctionConstants.GAME_ID);

		order.setAmount(0.0D);
		order.setPayMoney(auctionInfo.getCurrentPrice().doubleValue());

		OnlinePayVO vo = httpApiHandler.newOrder(order);
		if (vo == null) {
			log.error("payment error. auctionId:{}, userId:{}", auctionId, userId);
			return responseError("创建订单异常");
		}

		if (vo.isSuccess()) {
			log.info("create order successfully. auctionId:{}, userId:{}", auctionId, userId);
		} else {
			log.error("create order failed. auctionId:{}, userId:{}, rpc return code:{}, message:{}",
					auctionId, userId, vo.getCode(), vo.getMessage());
		}
		return vo;
	}
}
