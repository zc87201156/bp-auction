package com.bp.auction.common.pubsub;

/**
 * 消息处理接口
 * @author zwf
 */
public interface MessageHandler {
	/**
	 * 处理消息
	 * @param content 消息内容
	 * @throws Exception
	 */
	void process(String content) throws Exception;
}
