package com.bp.auction.server.controller.callback;

import com.bp.auction.common.constants.DeliveryStatus;
import com.bp.auction.common.constants.PaymentStatus;
import com.bp.auction.common.dal.entity.Auction;
import com.bp.auction.server.controller.request.DeliveryNotifyRequest;
import com.bp.auction.server.service.AuctionService;
import com.bp.core.response.ResponseBean;
import com.bp.core.web.base.BaseController;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;

/**
 * 发货回调
 *
 * @author zwf
 */
@Slf4j
@RestController
@RequestMapping("/dubbo/mq/callback/delivery")
public class DeliveryNotifyController extends BaseController {

    @Autowired
    private AuctionService auctionService;

    @RequestMapping("/notify")
    public ResponseBean notify(@RequestBody @Valid DeliveryNotifyRequest request) {
        Long auctionId = request.getBusinessId();
        Integer receiveStatus = request.getReceiveStatus();

        log.info("receive delivery notify message, businessId:{},activityId:{},receiveRemark:{},receiveStatus:{}",
                auctionId, request.getActivityId(), request.getReceiveRemark(), receiveStatus);

        if (auctionId == null) {
            log.error("process delivery notify message failed. businessId is null.");
            return responseError("businessId is null");
        }

        if (receiveStatus == null) {
            log.error("process delivery notify message failed. receiveStatus is null. auctionId:{}", auctionId);
            return responseError("receiveStatus is null");
        }

        DeliveryStatus status = DeliveryStatus.getByValue(receiveStatus);
        if (status == null) {
            log.warn("illegal receiveStatus:{}, auctionId:{}", receiveStatus, auctionId);
        }

        Auction auction = auctionService.getById(auctionId);
        if (auction == null) {
            log.error("process delivery notify message failed. auction not exists. auctionId:{}", auctionId);
            return responseError("auctionId not exists");
        }

        PaymentStatus paymentStatus = PaymentStatus.getByValue(auction.getPaymentStatus());
        //验证该拍卖是否已支付
        if (paymentStatus == null || paymentStatus != PaymentStatus.SUCCESS) {
            log.error("process delivery notify message failed. auction has not been paid. auctionId:{}", auctionId);
            return responseError("auction has not been paid");
        }

        //更新拍卖的发货状态
        auction.setDeliveryStatus(receiveStatus);
        auctionService.save(auction);
        log.info("process delivery notify message successfully. auctionId:{}, receiveStatus:{}", auctionId, receiveStatus);
        return responseSuccess();
    }
}
