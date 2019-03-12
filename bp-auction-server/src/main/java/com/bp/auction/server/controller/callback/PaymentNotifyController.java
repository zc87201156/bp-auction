package com.bp.auction.server.controller.callback;

import com.bp.auction.common.constants.*;
import com.bp.auction.common.dal.entity.Goods;
import com.bp.auction.server.controller.request.PaymentNotifyRequest;
import com.bp.auction.server.handler.HttpApiHandler;
import com.bp.auction.server.service.AuctionService;
import com.bp.auction.server.service.FreeAuctionFeeService;
import com.bp.auction.server.service.GoodsService;
import com.bp.auction.server.service.bo.AuctionInfo;
import com.bp.core.response.ResponseBean;
import com.bp.core.utils.type.DateUtils;
import com.bp.core.utils.type.NumberUtils;
import com.bp.core.utils.type.StringUtils;
import com.bp.core.web.base.BaseController;
import com.bp.platform.rpc.dto.ChannelInfoDto;
import com.bp.platform.rpc.dto.UserDto;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import java.util.Date;
import java.util.concurrent.TimeUnit;

/**
 * 支付回调
 * @author zwf
 */
@Slf4j
@RestController
@RequestMapping("/dubbo/mq/callback/payment")
public class PaymentNotifyController extends BaseController {

	@Autowired
	private RedisTemplate redisTemplate;

	@Autowired
	private AuctionService auctionService;

	@Autowired
	private GoodsService goodsService;

	@Autowired
	private FreeAuctionFeeService freeAuctionFeeService;

	@Autowired
	private HttpApiHandler httpApiHandler;

	@RequestMapping("/notify")
	public ResponseBean notify(@RequestBody @Valid PaymentNotifyRequest request) {
		String bizId = request.getBizId();
		String orderNo = request.getOrderNo();
		String paymentTime = request.getPaymentTime();

		log.info("receive payment notify message, bizId:{}, orderNo:{}, paymentTime:{}", bizId, orderNo, paymentTime);

		if (!NumberUtils.isDigits(bizId)) {
			log.error("process payment notify message failed. bizId must be a number. bizId:{}, orderNo:{}",
					bizId, orderNo);
			return responseError("param[bizId] must be a number.");
		}

		if (StringUtils.isBlank(orderNo)) {
			log.error("process payment notify message failed. orderNo is empty. bizId:{}", bizId);
			return responseError("param[orderNo] is empty");
		}

		Date paymentDate = DateUtils.parseDateTime(paymentTime);
		long auctionId = NumberUtils.toLong(bizId);

		//防止同时处理同一个拍卖
		if (!lock(auctionId)) {
			log.error("there is another message is being processed. auctionId:{}, orderNo:{}", auctionId, orderNo);
			return responseError("there is another message is being processed");
		}
		try {
			AuctionInfo auctionInfo = auctionService.getAuctionInfoById(auctionId);
			if (auctionInfo == null) {
				log.error("process payment notify message failed. auctionId[{}] not exists. orderNo:{}",
						auctionId, orderNo);
				return responseError("failed");
			}

			//如果已支付
			if (auctionInfo.getPaymentStatus() == PaymentStatus.SUCCESS) {
				log.warn("the auction[{}] has already paid. receive paymentOrderNo:{}", auctionId, orderNo);
				return responseError("already paid");
			}

			//校验拍卖状态，防止拍卖未成交时被误调用
			if (auctionInfo.getAuctionStatus() != AuctionStatus.SUCCESS) {
				log.error("the auction[{}] is not over. receive paymentOrderNo:{}", auctionId, orderNo);
				return responseError("auction is not over");
			}

			auctionInfo.setPaymentOrderNo(orderNo);
			auctionInfo.setPaymentTime(paymentDate);
			auctionInfo.setPaymentStatus(PaymentStatus.SUCCESS);
			//更新拍卖信息
			auctionService.saveAuctionInfo(auctionInfo);

			//如果是免手续费场或者暗排场，则该违约用户记录完成支付
			if (auctionInfo.getAuctionClass() == AuctionClass.FREE_AUCTION_FEE ||
					auctionInfo.getAuctionClass()==AuctionClass.SEALED) {
				freeAuctionFeeService.completePayment(auctionId, paymentDate);
			}

			//支付之后清除获取数量缓存
			auctionService.clearUserWinNum(auctionInfo.getCurrentUserId());

			Goods goods = goodsService.get(auctionInfo.getGoodsId());
			if (goods == null) {
				log.error("goods not exists. goodsId:{}, auctionId:{}, paymentOrderNo:{}", auctionInfo.getGoodsId(),
						auctionId, orderNo);
				return responseError("goods not exists");
			}
			Long platProductId = goods.getPlatProductId();
			if (platProductId == null) {
				log.error("goods platProductId is missing. goodsId:{}, auctionId:{}, paymentOrderNo:{}", goods.getId(),
						auctionId, orderNo);
				return responseError("goods platProductId is missing");
			}

			//调用平台发货接口
			Long userId = auctionInfo.getCurrentUserId();

			UserDto user = httpApiHandler.getByUserId(userId);
			if (user == null) {
				log.error("get user info error. userId:{}, auctionId:{}, paymentOrderNo:{}", userId, auctionId,
						orderNo);
				return responseError("get user info error");
			}

			Long channelId = user.getLastLoginChannelId();
			ChannelInfoDto parentChannelInfo = httpApiHandler.getParentChannel(channelId);
			Long parentChannelId = parentChannelInfo == null ? channelId : parentChannelInfo.getId();



			boolean b = httpApiHandler.sendAwards(auctionId, platProductId, userId, channelId, parentChannelId,
					AuctionConstants.PLAT_DELIVERY_NOTIFY_MQ);
			if (b) {
				log.info("process payment notify message successfully. auctionId:{}, paymentOrderNo:{}", auctionId,
						orderNo);
			} else {
				log.error("process payment notify message failed. auctionId:{}, paymentOrderNo:{}", auctionId,
						orderNo);
			}
		} finally {
			unlock(auctionId);
		}
		return responseSuccess();
	}

	private boolean lock(long auctionId) {
		Boolean result = redisTemplate.opsForValue().setIfAbsent(RedisCacheKey.PAYMENT_NOTIFY_LOCK.key(auctionId), "Y");
		if (result) {
			redisTemplate.expire(RedisCacheKey.PAYMENT_NOTIFY_LOCK.key(auctionId), 1, TimeUnit.MINUTES);
		}
		return result;
	}

	private void unlock(long auctionId) {
		redisTemplate.delete(RedisCacheKey.PAYMENT_NOTIFY_LOCK.key(auctionId));
	}
}
