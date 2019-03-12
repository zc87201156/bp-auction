package com.bp.auction.server.websocket;

/**
 * 协议号定义
 */
public class MessageDef {
	/**
	 * 错误信息响应
	 */
	public static final int ERROR_RESPONSE = 0;

	/**
	 * 心跳请求
	 */
	public static final int HEART_BEAT_REQUEST = 1;

	/**
	 * 心跳响应
	 */
	public static final int HEART_BEAT_RESPONSE = 2;

	/**
	 * 登录请求
	 */
	public static final int LOGIN_REQUEST = 10000;

	/**
	 * 登录响应
	 */
	public static final int LOGIN_RESPONSE = 10001;

	/**
	 * 踢玩家下线响应
	 */
	public static final int KICK_RESPONSE = 10002;

	/**
	 * 开始拍卖响应
	 */
	public static final int START_AUCTION_RESPONSE = 10003;

	/**
	 * 出价请求
	 */
	public static final int AUCTION_REQUEST = 10004;

	/**
	 * 出价响应
	 */
	public static final int AUCTION_RESPONSE = 10005;

	/***
	 * 托管出价响应
	 */
	public static final int DEPOSIT_AUCTION_RESPONSE=10006;

	/**
	 * 用户账户余额响应
	 */
	public static final int USER_ACCOUNT_BALANCE_RESPONSE = 10018;

	/**
	 * 客户端订阅或取消订阅拍卖信息变化请求
	 */
	public static final int AUCTION_INFO_CHANGE_USER_ID_REQUEST = 10019;

	/**
	 * 拍卖实时信息响应
	 */
	public static final int AUCTION_REALTIME_INFO_RESPONSE = 10020;

	/**
	 * 跑马灯响应
	 */
	public static final int MARQUEE_RESPONSE = 10021;

	/**
	 * 暗拍场用户出价响应
	 */
	public static final int SEALED_USER_AUCTION_RESPONSE = 10022;
	/**
	 * 活动响应
	 */
	public static final int ACTIVITY_RESPONSE=10023;

}
