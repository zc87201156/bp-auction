package com.bp.auction.common.constants;

/**
 * 配置项名称
 * @author zwf
 */
public class ConfigConstants {

	/**
	 * 同时进行的最大拍卖数
	 */
	public static final String MAX_AUCTION_NUM = "max_auction_num";

	/**
	 * 每个拍卖线程处理的最大拍卖数
	 */
	public static final String THREAD_DEAL_MAX_AUCTION_NUM = "thread_deal_max_auction_num";

	/**
	 * 拍卖定时任务线程池大小
	 */
	public static final String SCHEDULED_THREAD_POOL_SIZE = "scheduled_thread_pool_size";

	/**
	 * 拍卖倒计时(单位：秒)
	 */
	public static final String AUCTION_COUNT_DOWN_SECONDS = "auction_count_down_seconds";

	/**
	 * 某个商品往期拍卖查询返回的记录数量
	 */
	public static final String RECENT_AUCTION_NUM = "recent_auction_num";

	/**
	 * 我的竞拍查询返回的记录数量
	 */
	public static final String MY_AUCTION_NUM = "my_auction_num";

	/**
	 * 拍卖延迟支付秒数
	 */
	public static final String AUCTION_DELAY_PAYMENT_SECONDS = "auction_delay_payment_seconds";

	/**
	 * 锁定用户账户的秒数
	 */
	public static final String LOCK_USER_ACCOUNT_SECONDS = "lock_user_account_seconds";

	/**
	 * 控制开服停服等HTTP接口的密码
	 */
	public static final String SERVER_ADMIN_PASSWORD = "server_admin_password";

	/**
	 * 服务器地址
	 */
	public static final String SERVER_ADDRESS = "server_address";

	/**
	 * 某个拍卖出价记录查询返回的最大数量
	 */
	public static final String MAX_AUCTION_HISTORY_NUM = "max_auction_history_num";

	/**
	 * 跑马灯数量
	 */
	public static final String MARQUEE_NUM = "marquee_num";

	/**
	 * 接口返回拍神榜前X名
	 */
	public static final String TOP_AUCTION_KING_RANKING_NUM = "top_auction_king_ranking_num";

	/**
	 * 接口返回杠神榜前X名
	 */
	public static final String TOP_AUCTION_KILLER_RANKING_NUM = "top_auction_killer_ranking_num";

	/**
	 * 判断为新小户的天数
	 */
	public static final String BEGINNER_JUDGE_DAYS = "beginner_judge_days";

	/***
	 * 用户最大同时托管场次数
	 */
	public static final String USER_MAX_DEPOSIT="user_max_deposit";

	/**
	 * 小户的定义之二：最近一段时间(往前推N天)
	 */
	public static final String SMALL_USER_DATE_RANGE = "small_user_date_range";

	/**
	 * 小户的定义之一：拍中的次数小于此值
	 */
	public static final String SMALL_USER_AUCTION_SUCCESS_TIMES = "small_user_auction_success_times";

	/**
	 * 免手续费场保证金
	 */
	public static final String FREE_AUCTION_FEE_BAIL_AMOUNT = "free_auction_fee_bail_amount";

	/**
	 * 暗拍定价排名列表每页显示的条数
	 */
	public static final String QUERY_SEALED_AUCTION_RANKING_PAGE_SIZE = "query_sealed_auction_ranking_page_size";

	/**
	 * 大厅列表中显示当前时间之后X分钟之内即将开始的滚拍
	 */
	public static final String ADVANCE_DISPLAY_ROLL_AUCTION_MINUTES = "advance_display_roll_auction_minutes";

	/**
	 * 暗拍提前X秒锁定用户出价，用于定价排名结算
	 */
	public static final String SEALED_AUCTION_SETTLING_SECONDS = "sealed_auction_settling_seconds";
}
