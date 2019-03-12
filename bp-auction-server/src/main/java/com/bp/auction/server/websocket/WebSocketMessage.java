package com.bp.auction.server.websocket;

import lombok.Data;

import java.io.Serializable;

/**
 * websocket消息
 * @author zwf
 */
@Data
public class WebSocketMessage implements Serializable {

	/**
	 * 需推送的拍卖id
	 */
	private Long auctionId;

	/**
	 * 需推送的用户id
	 */
	private Long[] userIds;

	/**
	 * 存储ProtoBuf序列化数据
	 */
	private byte[] message;
}
