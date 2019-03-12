package com.bp.auction.common.constants;

/**
 * 拍卖常量定义
 * @author zwf
 */
public class AuctionConstants {

	/**
	 * 拍卖项目的游戏id
	 */
	public static final int GAME_ID = 19;

	/**
	 * 空字符串
	 */
	public static final String BLANK = "";

	/**
	 * 平台配置的拍卖商品的类型
	 */
	public static final int PLAT_PRODUCT_TYPE = 125;

	/**
	 * 平台活动类型
	 */
	public static final int PLAT_ACTIVITY_TYPE = 68;
	/**
	 * 拍卖榜单类奖励对应平台发奖类型
	 */
	public static final int PLAT_RANK_AWARD_TYPE = 69;
	/**
	 * 竞拍项目平台发货备注
	 */
	public static final String PLAT_SEND_AWARDS_REMARK = "蜜蜂拍卖发货";

	public static final String PLAT_KILLER_RANK_AWARDS_REMARK="蜜蜂拍卖杠神榜奖励发放";

	public static final String PLAT_KING_RANK_AWARDS_REMARK="蜜蜂拍卖拍神榜奖励发放";

	/**
	 * 平台发货回调通知MQ
	 */
	public static final String PLAT_DELIVERY_NOTIFY_MQ = "wf_auction_delivery_notify";

	/**
	 * 新手引导发货回调通知MQ
	 */
	public static final String BEGINNER_DELIVERY_NOTIFY_MQ = "wf_auction_beginner_delivery_notify";

    /***
     * 平台榜单派奖回调通知MQ
     */
    public static final String PLAT_RANKAWARD_NOTIFY_MQ = "wf_auction_rankAward_notify";

	/**
	 * IP归属地查询URL
	 */
	public static final String IP_QUERY_URL = "http://ip.taobao.com/service/getIpInfo.php?ip=";

	/**
	 * 平台站内信参数
	 */
	public static final int PLAT_MESSAGE_TYPE = 1;

	/**
	 * 平台站内信参数
	 */
	public static final int PLAT_MESSAGE_SOURCE = 3;

	/**
	 * 平台站内信参数
	 */
	public static final int PLAT_MESSAGE_STATUS = 0;

	/**
	 * 平台站内信参数
	 */
	public static final int PLAT_MESSAGE_AWARD_STATUS = 2;

	/**
	 * 平台站内信参数
	 */
	public static final String PLAT_MESSAGE_LINK_URL = "";

	/**
	 * 平台站内信参数
	 */
	public static final int PLAT_MESSAGE_SENDER_TYPE = 21;

	/**
	 * 平台站内信MQ
	 */
	public static final String PLAT_MESSAGE_MQ = "add_message_center_log";

	/**
	 * 站内信标题
	 */
	public static final String PLAT_MESSAGE_TITLE = "%s奖励通知";

	/**
	 * 站内信内容
	 */
	public static final String PLAT_MESSAGE_CONTENT = "亲爱的%s，恭喜您获得%s%s期第%s名，奖励%s已发放至您的个人账户，请到'我的'进行查看。";

	/**
	 * 拍卖成交站内信标题
	 */
	public static final String AUCTION_MESSAGE_TITLE = "竞拍成功通知";

	/**
	 * 拍卖成交站内信内容
	 */
	public static final String AUCTION_MESSAGE_CONTENT = "恭喜您拍得%s，请尽快以成交价支付拍品货款，您可以在‘我的竞拍’内查找对应订单，24小时内支付有效。";
}
