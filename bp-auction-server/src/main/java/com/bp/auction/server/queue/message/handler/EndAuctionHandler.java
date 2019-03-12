package com.bp.auction.server.queue.message.handler;

import com.bp.auction.common.queue.message.DelayMessage;
import com.bp.auction.server.queue.message.DelayMessageHandler;
import com.bp.auction.server.service.MainService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * 拍卖结束消息处理器
 * @author zwf
 */
@Slf4j
@Component
public class EndAuctionHandler implements DelayMessageHandler {

	@Autowired
	private MainService mainService;

	@Override
	public void process(DelayMessage message) throws Exception {
		mainService.endAuction(message.getAuctionId(), message.getCount());
	}
}
