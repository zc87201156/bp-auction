package com.bp.auction.server.handler;

import com.bp.auction.common.constants.AuctionConstants;
import com.bp.auction.common.constants.BusinessType;
import com.bp.core.response.ResponseBean;
import com.bp.core.utils.TraceIdUtils;
import com.bp.platform.rpc.dto.*;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang.exception.ExceptionUtils;
import org.apache.http.HttpStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.util.List;

/**
 * @author zc
 * @create 2019-02-20 11:16
 * @desc 统一封装平台所有需要调用的外部http服务
 **/
@Component
@Slf4j
public class HttpApiHandler {

    @Autowired
    private RestTemplate restTemplate;

    @Value("${custom.dubbo.url}")
    private String dubboUrl;

    private static final String BLANK = "";

    /***
     * 根据用户ID查询平台用户信息(接口url:/bp/dubbo/rpc/user/getByUserId/{userId})
     * @param userId
     * @return
     */
    public UserDto getByUserId(long userId) {
        UserDto userDto = null;
        String url = dubboUrl + "/rpc/user/getByUserId/" + userId;
        try {
            userDto = restTemplate.getForObject(url, UserDto.class);
        } catch (Exception e) {
            log.error("getByUserId  url:{} error:{}", url, ExceptionUtils.getStackTrace(e));
        }
        return userDto;
    }

    /***
     * 根据token查询平台用户信息 (接口url:/bp/dubbo/rpc/user/getUserInfo/{token})
     * @param token
     * @return
     */
    public UserInfoDto getUserInfo(String token) {
        String url = dubboUrl + "/rpc/user/getUserInfo/" + token;
        UserInfoDto userInfoDto = null;
        try {
            userInfoDto = restTemplate.getForObject(url, UserInfoDto.class);
        } catch (Exception e) {
            log.error("getUserInfo  url:{} error:{}", url, ExceptionUtils.getStackTrace(e));
        }
        return userInfoDto;
    }

    /***
     * 根据渠道ID获取渠道信息(接口url:/bp/dubbo/rpc/channel/getParentChannel/{channelId})
     * @param channelId
     * @return
     */
    public ChannelInfoDto getParentChannel(long channelId) {
        String url = dubboUrl + "/rpc/channel/getParentChannel/" + channelId;
        ChannelInfoDto channelInfoDto = null;
        try {
            channelInfoDto = restTemplate.getForObject(url, ChannelInfoDto.class);
        } catch (Exception e) {
            log.error("getParentChannel  url:{} error:{}", url, ExceptionUtils.getStackTrace(e));
        }
        return channelInfoDto;
    }

    /***
     * 平台锁金叶子账户 (接口url:/bp/dubbo/rpc/account/lockAccount)
     * @param userId
     * @param lockSeconds
     * @return
     */
    public boolean lockAccount(long userId, int lockSeconds) {
        String url = dubboUrl + "/rpc/account/lockAccount";
        RpcResponse<Integer> rpcResponse = null;
        String rsp = null;
        try {
            AccountLockInfoDto lockInfo = new AccountLockInfoDto();
            lockInfo.setGameId(AuctionConstants.GAME_ID);
            lockInfo.setUserId(userId);
            lockInfo.setLockSecond(lockSeconds);
            RpcRequest<AccountLockInfoDto> request = new RpcRequest<>();
            request.setData(lockInfo);
            request.setTraceId(AuctionConstants.GAME_ID + "-" + userId);
            rsp = restTemplate.postForObject(url, request, String.class);
            ObjectMapper mapper = new ObjectMapper();
            rpcResponse = mapper.readValue(rsp, new TypeReference<RpcResponse<Integer>>() {
            });
        } catch (Exception e) {
            log.error("lockAccount  url:{} error:{}", url, ExceptionUtils.getStackTrace(e));
        }
        if (rpcResponse != null && rpcResponse.getCode() == HttpStatus.SC_OK) {
            return true;
        }
        log.info("lockAccount  url:{} rsp:{}", url, rsp);
        return false;
    }

    /***
     * 平台解锁账户(接口url:/bp/dubbo/rpc/account/unLockAccount)
     * @param userId
     * @return
     */
    public ResponseBean unLockAccount(long userId) {
        String url = dubboUrl + "/rpc/account/unLockAccount";
        ResponseBean rspBean = null;
        try {
            RpcRequest<Long> request = new RpcRequest<>();
            request.setData(userId);
            request.setTraceId(AuctionConstants.GAME_ID + "-" + userId);
            rspBean = restTemplate.postForObject(url, request, ResponseBean.class);
        } catch (Exception e) {
            log.error("unLockAccount  url:{} error:{}", url, ExceptionUtils.getStackTrace(e));
        }
        return rspBean;
    }

    /***
     * 更新平台账户 (接口url:/bp/dubbo/rpc/account/updateAccount)
     * @param amount
     * @param businessType
     * @param businessId
     * @param userId
     * @param channelId
     * @return
     */
    public BigDecimal updateAccount(long amount, BusinessType businessType, long businessId, long userId, long channelId) {
        String url = dubboUrl + "/rpc/account/updateAccount";
        try {
            TransactionLogDto transactionLog = new TransactionLogDto();
            transactionLog.setBusinessType(businessType.getValue());
            transactionLog.setChangeUseMoney(-amount);
            transactionLog.setBusinessId(businessId);
            transactionLog.setRemark(businessType.getRemark());
            transactionLog.setUserId(userId);
            transactionLog.setChannelId(channelId);
            transactionLog.setGameId(AuctionConstants.GAME_ID);
            RpcRequest<TransactionLogDto> request = new RpcRequest<>();
            request.setData(transactionLog);
            request.setTraceId(AuctionConstants.GAME_ID + "-" + TraceIdUtils.getTraceId());
            //含有泛型的类反序列化必须特殊处理
            String rsp = restTemplate.postForObject(url, request, String.class);

            ObjectMapper mapper = new ObjectMapper();
            RpcResponse<TransAccountDto> rpcResponse = mapper.readValue(rsp, new TypeReference<RpcResponse<TransAccountDto>>() {});

            if (rpcResponse == null) {
                log.error("call update account error, return null, userId:{}", userId);
                return null;
            }

            if (!rpcResponse.isSuccess()) {
                log.error("call update account failed, userId:{}, return code:{}, msg:{}", userId, rpcResponse.getCode(), rpcResponse.getMsg());
                return null;
            }
            return new BigDecimal(rpcResponse.getData().getUseAmount() + BLANK);
        } catch (Exception e) {
            log.error("update account userId:{},  url:{} error:{}", userId, url, ExceptionUtils.getStackTrace(e));
            return null;
        }
    }

    /***
     * 查询用户账户信息 (接口url:/bp/dubbo/rpc/account/getAccountByUserId)
     * @param userId
     * @return
     */
    public TransAccountDto getAccountByUserId(Long userId) {
        String url = dubboUrl + "/rpc/account/getByUserId/" + userId;
        TransAccountDto transAccountDto = null;
        try {
            transAccountDto = restTemplate.getForObject(url, TransAccountDto.class);
        } catch (Exception e) {
            log.error("getAccountByUserId  url:{} error:{}", url, ExceptionUtils.getStackTrace(e));
        }
        return transAccountDto;
    }

    /***
     * 平台发送奖励 (接口url:/bp/dubbo/rpc/awards/send/saveAndReturnAwards)
     * @param sendAwardsInfoDto
     * @return
     */
    public SendAwardsInfoRespDto saveAndReturnAwards(SendAwardsInfoDto sendAwardsInfoDto) {
        String url = dubboUrl + "/rpc/awards/send/saveAndReturnAwards";
        SendAwardsInfoRespDto sendAwardsInfoRespDto = null;
        try {
            sendAwardsInfoRespDto = restTemplate.postForObject(url, sendAwardsInfoDto, SendAwardsInfoRespDto.class);
        } catch (Exception e) {
            log.error("saveAndReturnAwards  url:{} error:{}", url, ExceptionUtils.getStackTrace(e));
        }
        return sendAwardsInfoRespDto;
    }

    /***
     * 招财猫查询用户等级 (接口url:/bp/dubbo/rpc/cat/getCatVipLev/{userId})
     * @param userId
     * @return
     */
    public Integer getCatVipLev(Long userId) {
        String url = dubboUrl + "/rpc/cat/getCatVipLev/" + userId;
        Integer res = null;
        try {
            res = restTemplate.getForObject(url, Integer.class);
        } catch (Exception e) {
            log.error("getCatVipLev  url:{} error:{}", url, ExceptionUtils.getStackTrace(e));
        }
        return res;
    }

    /**
     * 下单接口 (接口url:/bp/dubbo/rpc/convert/newOrder)
     *
     * @param createOrderInfoDto
     * @return
     */
    public OnlinePayVO newOrder(CreateOrderInfoDto createOrderInfoDto) {
        String url = dubboUrl + "/rpc/convert/newOrder";
        OnlinePayVO onlinePayVO = null;
        try {
            onlinePayVO = restTemplate.postForObject(url, createOrderInfoDto, OnlinePayVO.class);
        } catch (Exception e) {
            log.error("newOrder  url:{} error:{}", url, ExceptionUtils.getStackTrace(e));
        }
        return onlinePayVO;
    }

    /**
     * 查询平台商品信息接口 (接口url:/bp/dubbo/rpc/product/getProductAwards/{productType}/{productId})
     *
     * @param productType
     * @param productId
     * @return
     */
    public List<ProductAwardsConfigDto> getProductAwards(Integer productType, Long productId) {
        String url = dubboUrl + "/rpc/product/getProductAwards/" + productType + "/" + productId;
        List<ProductAwardsConfigDto> result = null;
        try {
            String response = restTemplate.getForObject(url, String.class);
            ObjectMapper mapper = new ObjectMapper();
            result = mapper.readValue(response, new TypeReference<List<ProductAwardsConfigDto>>(){});
        } catch (Exception e) {
            log.error("getProductAwards  url:{} error:{}", url, ExceptionUtils.getStackTrace(e));
        }
        return result;
    }

    /***
     *  查询商城商品信息 (接口url:/bp/dubbo/rpc/product/getProductWelfare/{id})
     * @param id
     * @return
     */
    public ProductWelfareDto getProductWelfare(Long id) {
        String url = dubboUrl + "/rpc/product/getProductWelfare/" + id;
        ProductWelfareDto productWelfareDto = null;
        try {
            productWelfareDto = restTemplate.getForObject(url, ProductWelfareDto.class);
        } catch (Exception e) {
            log.error("getProductWelfare  url:{} error:{}", url, ExceptionUtils.getStackTrace(e));
        }
        return productWelfareDto;
    }

    /***
     * 查询用户是否在灰名单 (接口url:/bp/dubbo/rpc/user/group/isGray/{userId})
     * @param userId
     * @return
     */
    public Boolean isGray(Long userId) {
        String url = dubboUrl + "/rpc/user/group/isGray/" + userId;
        Boolean res = null;
        try {
            res = restTemplate.getForObject(url, Boolean.class);
        } catch (Exception e) {
            log.error("isGray  url:{} error:{}", url, ExceptionUtils.getStackTrace(e));
        }
        return res;
    }

    /**
     * 发送平台站内信
     * @param title 站内信标题
     * @param content 站内信内容
     * @param userId 用户id
     * @return
     */
    public ResponseBean sendMessage(String title, String content, long userId) {
        MessageResponseDto dto = new MessageResponseDto();
        dto.setTitle(title);
        dto.setContent(content);
        dto.setUserId(userId);
        dto.setType(AuctionConstants.PLAT_MESSAGE_TYPE);
        dto.setSource(AuctionConstants.PLAT_MESSAGE_SOURCE);
        dto.setMessageStatus(AuctionConstants.PLAT_MESSAGE_STATUS);
        dto.setAwardStatus(AuctionConstants.PLAT_MESSAGE_AWARD_STATUS);
        dto.setLinkUrl(AuctionConstants.PLAT_MESSAGE_LINK_URL);
        dto.setSenderType(AuctionConstants.PLAT_MESSAGE_SENDER_TYPE);

        String url = dubboUrl + "/mq/message/center/send/" + AuctionConstants.PLAT_MESSAGE_MQ;
        ResponseBean response = null;
        try {
            response = restTemplate.postForObject(url, dto, ResponseBean.class);
        } catch (Exception e) {
            log.error("message center send error url:{}, error:{}", url, ExceptionUtils.getStackTrace(e));
        }
        return response;
    }

    /**
     * 发货
     * @param businessId 业务id
     * @param platProductId 平台商品id
     * @param userId 用户id
     * @param channelId 渠道id
     * @param parentChannelId 父渠道id
     * @param callbackQueue 平台发货回调MQ名称
     * @return true-发货成功,false-发货失败
     */
    public boolean sendAwards(Long businessId, Long platProductId, Long userId, Long channelId, Long parentChannelId,
                              String callbackQueue) {
        log.info("begin to send awards, businessId:{}, platProductId:{}, userId:{}, channelId:{}, " +
                        "parentChannelId:{}, callbackQueue:{}",
                businessId, platProductId, userId, channelId, parentChannelId, callbackQueue);
        try {
            List<ProductAwardsConfigDto> awards = getProductAwards(AuctionConstants.PLAT_PRODUCT_TYPE,
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

                SendAwardsInfoRespDto result = saveAndReturnAwards(dto);
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
                    channelId, parentChannelId, callbackQueue, org.apache.commons.lang3.exception.ExceptionUtils.getStackTrace(e));
            return false;
        }
    }
}
