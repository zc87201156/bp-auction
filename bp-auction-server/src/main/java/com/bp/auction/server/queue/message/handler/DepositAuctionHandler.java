package com.bp.auction.server.queue.message.handler;

import com.bp.auction.common.queue.message.DelayMessage;
import com.bp.auction.server.queue.message.DelayMessageHandler;
import com.bp.auction.server.service.DepositService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Component;

/***
 * @Author: zc
 * @Date : 2019/2/26
 * @Description: 托管出价延迟消息处理器
 **/
@Slf4j
@Component
public class DepositAuctionHandler implements DelayMessageHandler {

    @Autowired
    private StringRedisTemplate stringRedisTemplate;
    @Autowired
    private DepositService depositService;

    @Override
    public void process(DelayMessage message) throws Exception {
        depositService.depositAuction(message.getAuctionId(), message.getUserId());
    }
}
