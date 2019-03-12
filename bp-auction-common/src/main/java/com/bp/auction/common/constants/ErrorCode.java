package com.bp.auction.common.constants;

/**
 * 游戏错误信息
 * 
 * @author zwf
 *
 */
public class ErrorCode {

	public static final int SUCCESS = 0;

	public static final int FAILURE = 1;


	/**
	 * 请求参数错误
	 */
	public static final int REQUEST_PARAM_ERROR = 5;

	/**
	 * 服务器在线已达上限
	 */
	public static final int GAME_ONLINE_MAX = 2;

	/**
	 * 黑名单
	 */
	public static final int BLACKLIST = 3;

	/**
	 * 非法操作
	 */
	public static final int ILLEGAL_OPERATION = 4;

	/**
	 * 用户不存在
	 */
	public static final int USER_NOT_EXIST = 1000;

	/**
	 * 获取用户信息失败
	 */
	public static final int GET_USER_INFO_ERROR = 1001;

	/**
	 * 操作太频繁
	 */
	public static final int OPERATION_TOO_FREQUENT = 1003;

	/**
	 * 拍卖信息不存在
	 */
	public static final int AUCTION_INFO_NOT_EXISTS = 1004;

	/**
	 * 拍卖未开始
	 */
	public static final int AUCTION_HAS_NOT_STARTED = 1005;

	/**
	 * 拍卖已结束
	 */
	public static final int AUCTION_IS_OVER = 1006;

	/**
	 * 用户余额不足
	 */
	public static final int USER_BALANCE_NOT_ENOUGH = 1007;

	/**
	 * 锁定用户账户失败
	 */
	public static final int LOCK_ACCOUNT_FAILED = 1008;

	/**
	 * 用户拍卖已领先
	 */
	public static final int USER_AUCTION_LEAD = 1009;

	/**
	 * 用户此状态不能进行托管操作
	 */
	public static final int CAN_NOT_DEPOSIT_THIS_STATUS = 1010;

	/**
	 * 新手滚拍配置不存在
	 */
	public static final int BEGINNER_ROLL_AUCTION_NOT_EXISTS = 1011;

	/**
	 * 新手场不被允许(用户不符合新手场条件)
	 */
	public static final int BEGINNER_FORBIDDEN = 1012;

	/***
	 * 用户托管场次超限
	 */
	public static final int DEPOSIT_AUCTION_OVER_LIMIT = 1013;

	/***
	 * 该场次不能托管
	 */
	public static final int NOT_ALLOW_DEPOSIT = 1014;

	/**
	 * 非新用户
	 */
	public static final int NOT_BEGINNER_USER = 1015;

	/**
	 * 新手商品不存在
	 */
	public static final int BEGINNER_GOODS_NOT_EXISTS = 1016;

	/**
	 * 调用平台发货接口失败
	 */
	public static final int SEND_PLATFORM_AWARDS_FAILED = 1017;

	/**
	 * 违约用户
	 */
	public static final int VIOLATED_USER = 1018;

	/**
	 * 免手续费场已报名
	 */
	public static final int ALREADY_ENROLL_FREE_AUCTION_FEE = 1019;

	/**
	 * 非免手续费场拍卖
	 */
	public static final int NOT_FREE_AUCTION_FEE_AUCTION = 1020;

	/**
	 * 无效的免手续费场报名费
	 */
	public static final int ILLEGAL_FREE_ENTRY_FEE = 1021;

	/**
	 * 非违约用户
	 */
	public static final int NOT_VIOLATED_USER = 1022;

	/**
	 * 免手续费场未报名
	 */
	public static final int NOT_ENROLL_FREE_AUCTION_FEE = 1023;

	/**
	 * 无效的免手续费场加价幅度
	 */
	public static final int ILLEGAL_FREE_RAISE_PRICE = 1024;

	/**
	 * 非暗拍场拍卖
	 */
	public static final int NOT_SEALED_AUCTION = 1025;
	/**
	 * 暗拍场拍卖结束时间丢失(防止程序出错，暗拍场拍卖结束时间未正确生成)
	 */
	public static final int SEALED_AUCTION_END_TIME_MISSING = 1026;
	/**
	 * 拍卖未成交
	 */
	public static final int AUCTION_NOT_SUCCESS = 1027;
	/***
	 * 当前价格已经超过商品市场价
	 */
	public static final int CURRENT_PRICE_OVER_MARKET = 1028;

	/**
	 * 暗拍场用户无定价排名
	 */
	public static final int SEALED_AUCTION_USER_NO_RANKING = 1029;
}