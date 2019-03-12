package com.bp.auction.server.queue.message;

import com.bp.auction.common.queue.message.DelayMessage;

/**
 * 延迟消息处理器
 * @author zwf
 */
public interface DelayMessageHandler {

	/**
	 * 处理具体的消息
	 * @param message 消息
	 * @throws Exception
	 */
	void process(DelayMessage message) throws Exception;
}
