package com.bp.auction.server.queue.message;

import com.bp.auction.common.queue.message.DelayMessageType;
import com.bp.auction.server.queue.message.handler.DepositAuctionHandler;
import com.bp.auction.server.queue.message.handler.EndAuctionHandler;
import com.bp.auction.server.queue.message.handler.StartAuctionHandler;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * @author zwf
 */
@Component
public class DelayMessageHandlerFactory {

	@Autowired
	private StartAuctionHandler startAuctionHandler;
	@Autowired
	private DepositAuctionHandler depositAuctionHandler;
	@Autowired
	private EndAuctionHandler endAuctionHandler;

	/**
	 * 根据消息类型返回对应的消息处理器
	 * @param type 消息类型
	 * @return
	 */
	public DelayMessageHandler getHandler(DelayMessageType type) {
		switch (type) {
			case START_AUCTION:
				return startAuctionHandler;
			case DEPOSIT_AUCTION:
				return depositAuctionHandler;
			case END_AUCTION:
				return endAuctionHandler;
		}
		throw new RuntimeException("can not find DelayMessageHandler for messageType[" + type + "]");
	}
}
