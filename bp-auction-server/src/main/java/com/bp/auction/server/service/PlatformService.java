package com.bp.auction.server.service;

import com.bp.auction.common.constants.AuctionConstants;
import com.bp.auction.server.handler.HttpApiHandler;
import com.bp.platform.rpc.dto.ProductAwardsConfigDto;
import com.bp.platform.rpc.dto.SendAwardsInfoDto;
import com.bp.platform.rpc.dto.SendAwardsInfoRespDto;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.exception.ExceptionUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * @author wcq
 * @version $Id: PlatformService.java, v0.1 2019/2/21 Exp $$
 */
@Slf4j
@Service
public class PlatformService {

    @Autowired
    private HttpApiHandler httpApiHandler;

    /**
     * 发货
     *
     * @param businessId      业务id
     * @param platProductId   平台商品id
     * @param userId          用户id
     * @param channelId       渠道id
     * @param parentChannelId 父渠道id
     * @param callbackQueue   平台发货回调MQ名称
     * @return true-发货成功,false-发货失败
     */
    public boolean sendAwards(Long businessId, Long platProductId, Long userId, Long channelId, Long parentChannelId,
                              String callbackQueue) {
        log.info("begin to send awards, businessId:{}, platProductId:{}, userId:{}, channelId:{}, " +
                        "parentChannelId:{}, callbackQueue:{}",
                businessId, platProductId, userId, channelId, parentChannelId, callbackQueue);
        try {
            List<ProductAwardsConfigDto> awards = httpApiHandler.getProductAwards(AuctionConstants.PLAT_PRODUCT_TYPE,
                    platProductId);
            if (awards == null || awards.isEmpty()) {
                log.error("productRpcService.getProductAwards return empty. platProductId:{}", platProductId);
                return false;
            }

            boolean success = true;
            for (ProductAwardsConfigDto award : awards) {
                SendAwardsInfoDto dto = new SendAwardsInfoDto();
                dto.setUserId(userId);
                dto.setAwardsType(award.getAwardsType());
                dto.setChannelId(channelId);
                dto.setParentChannelId(parentChannelId == null ? channelId : parentChannelId);
                dto.setActivityType(AuctionConstants.PLAT_ACTIVITY_TYPE);
                dto.setCallBackQuque(callbackQueue);

                if (award.getAwardsNum() != null) {
                    dto.setBusinessAmount(Long.valueOf(award.getAwardsNum()));
                }
                dto.setBusinessId(businessId);
                dto.setBusinessType(AuctionConstants.PLAT_PRODUCT_TYPE);
                dto.setBusinessRemark(AuctionConstants.PLAT_SEND_AWARDS_REMARK);
                dto.setFragmentId(award.getPhyAwardsId());
                dto.setAwardsNum(award.getAwardsNum());
                dto.setPhyAwardsId(award.getPhyAwardsId());
                dto.setGameId(AuctionConstants.GAME_ID);

                SendAwardsInfoRespDto result = httpApiHandler.saveAndReturnAwards(dto);
                if (!result.success()) {
                    success = false;
                    log.error("send awards failed. userId:{}, channelId:{}, parentChannelId:{}, platProductId:{}" +
                                    " awardsSendRpcService return code:{}, msg:{}, remark:{}",
                            userId, channelId, parentChannelId, platProductId, result.getCode(), result.getMessage(),
                            result.getReceiveRemark());
                }
            }
            return success;
        } catch (Exception e) {
            log.error("send awards error, businessId:{}, platProductId:{}, userId:{}, channelId:{}," +
                            " parentChannelId:{}, callbackQueue:{}, ex:{}", businessId, platProductId, userId,
                    channelId, parentChannelId, callbackQueue, ExceptionUtils.getStackTrace(e));
            return false;
        }
    }
}
