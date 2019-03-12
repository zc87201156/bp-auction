package com.bp.auction.server.controller.callback;

import com.bp.auction.common.constants.DeliveryStatus;
import com.bp.auction.common.dal.entity.BeginnerAuction;
import com.bp.auction.server.controller.request.DeliveryNotifyRequest;
import com.bp.auction.server.service.BeginnerAuctionService;
import com.bp.core.response.ResponseBean;
import com.bp.core.web.base.BaseController;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;

/**
 * 新手发货回调
 *
 * @author wcq
 */
@Slf4j
@RestController
@RequestMapping("/dubbo/mq/callback/beginner/delivery")
public class BeginnerDeliveryNotifyController extends BaseController {

    @Autowired
    private BeginnerAuctionService beginnerAuctionService;

    @RequestMapping("/notify")
    public ResponseBean notify(@RequestBody @Valid DeliveryNotifyRequest request) {
        Long beginnerAuctionId = request.getBusinessId();
        Integer receiveStatus = request.getReceiveStatus();

        if (beginnerAuctionId == null) {
            log.error("process beginner delivery notify message failed. businessId is null.");
            return responseError("businessId is null");
        }

        if (receiveStatus == null) {
            log.error("process beginner delivery notify message failed. receiveStatus is null. beginnerAuctionId:{}",
                    beginnerAuctionId);
            return responseError("receiveStatus is null");
        }

        DeliveryStatus status = DeliveryStatus.getByValue(receiveStatus);
        if (status == null) {
            log.warn("illegal receiveStatus:{}, beginnerAuctionId:{}", receiveStatus, beginnerAuctionId);
        }
        BeginnerAuction beginnerAuction = beginnerAuctionService.getById(beginnerAuctionId);
        if (beginnerAuction == null) {
            log.error("process beginner delivery notify message failed. beginnerAuction not exists. beginnerAuctionId:{}",
                    beginnerAuctionId);
            return responseError("beginnerAuction not exists");
        }

        //更新拍卖的发货状态
        beginnerAuction.setDeliveryStatus(receiveStatus);
        beginnerAuctionService.save(beginnerAuction);
        log.info("process beginner delivery notify message successfully. beginnerAuctionId:{}, receiveStatus:{}",
                beginnerAuctionId, receiveStatus);

        return responseSuccess();
    }
}
