package com.bp.auction.common.pubsub;

/**
 * 消息类型
 * @author zwf
 */
public enum MessageType {
	/**
	 * 配置项缓存
	 */
	CONFIG,
	/**
	 * 拍卖
	 */
	AUCTION,
	/***
	 *滚拍
	 */
	ROLL_AUCTION;
}
