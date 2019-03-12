package com.bp.auction.common.constants;


import com.bp.auction.common.util.SysUtil;
import com.bp.core.cache.CacheKey;

/**
 * Redis缓存Key
 *
 * @author zwf
 */
public enum RedisCacheKey implements CacheKey {

    /**
     * 所有手续费配置
     */
    ALL_AUCTION_FEES,
    /**
     * 指定id的商品
     */
    GOODS_BY_ID,
    /**
     * 指定id的拍卖信息
     */
    AUCTION_INFO_BY_ID,
    /**
     * 往期成交拍卖
     */
    LAST_SUCCESS_AUCTIONS,
    /**
     * 指定状态为进行中拍卖id的拍卖记录（zset结构）
     */
    AUCTION_HISTORY_AUCTIONING,
    /**
     * 指定状态为已成交的拍卖历史记录(key-value结构)
     */
    AUCTION_HISTORY_SUCCESS,
    /**
     * 支付回调处理锁，防止同时处理同一个拍卖订单
     */
    PAYMENT_NOTIFY_LOCK,
    /**
     * 某场拍卖已出价的用户id
     */
    AUCTIONED_USER_ID,
    /**
     * 某场拍卖围观人次
     */
    ONLOOKER_COUNT,
    /**
     * 拍卖大厅id列表
     */
    AUCTION_HALL_ID_LIST,
    /**
     * 跑马灯
     */
    MARQUEE,
    /**
     * 拍神信息
     */
    AUCTION_KING_INFO,
    /**
     * 拍神榜
     */
    AUCTION_KING_RANKING,
    /**
     * 杠神榜
     */
    AUCTION_KILLER_RANKING,
    /**
     * 榜单奖励配置
     */
    RANK_AWARD_CONFIG,
    /***
     * banner图列表
     */
    BANNER_LIST,
    /**
     * 从数据库中加载出来的某个拍卖的所有属性
     */
    ALL_ATTRIBUTES_FROM_DB_BY_AUCTION_ID,
    /***
     * 某商品下一场未结束的拍卖场次信息
     */
    GOODS_AUCTION_NEXT,
    /***
     * 滚拍列表
     */
    ROLL_AUCTION_LIST,
    /***
     * 场次列表
     */
    CATEGORY_LIST,
    /***
     * 场次商品列表
     */
    CATEGORY_GOODS_LIST,
    /**
     * 用户当前所在的拍卖id
     */
    USER_CURRENT_AUCTION_ID,
    /***
     * 每期托管记录
     */
    DEPOSIT_RECORD,
    /***
     * 用户赢得的拍卖商品数量
     */
    USER_WIN_AUCTION_NUM,
    /**
     * 新手信息
     */
    BEGINNER,
    /***
     * 用户正托管的场次记录
     */
    USER_DEPOSIT_RECORD,
    /**
     * 所有新手商品
     */
    ALL_BEGINNER_GOODS,
    /**
     * 新用户出价锁,防止恶意并发
     */
    BEGINNER_AUCTION_LOCK,
    /**
     * 新手拍卖记录
     */
    BEGINNER_AUCTION,
    /**
     * 用户每天拍中的次数
     */
    USER_AUCTION_SUCCESS_TIMES_BY_DAY,
    /**
     * 用户是否是小户
     */
    SMALL_USER,
    /**
     * 违约用户
     */
    VIOLATION_USER,
    /**
     * 免手续费场已报名用户
     */
    FREE_AUCTION_FEE_ENROLL_USERS,
    /**
     * 用户报名锁，防止并发
     */
    FREE_AUCTION_FEE_ENROLL_LOCK,
    /**
     * 用户交保证金锁，防止并发
     */
    FREE_AUCTION_FEE_PAY_BAIL_LOCK,
    /**
     * 暗拍场用户出价信息
     */
    SEALED_AUCTION_INFO,
    /**
     * 暗拍场查询用户离开期间出价人数的起始时间
     */
    QUERY_SEALED_AUCTIONED_USER_COUNT_TIME,
    /**
     * 暗拍场用户出价时间(用于统计用户离开期间的出价人数)
     */
    SEALED_USER_AUCTION_TIME,
    /**
     * 暗拍场用户出价锁，防止并发
     */
    SEALED_USER_AUCTION_LOCK,
    /**
     * 我的暗拍场排名
     */
    MY_SEALED_AUCTION_RANKING,
    /***
     * 活动记录配置
     */
    ACTIVITY_LIST,
    /***
     * 活动概率
     */
    ACTIVITY_PROBABILITY,
    /***
     * 缓存每日登陆过的用户
     */
    USER_DAY_LOGIN,
    /***
     * 某活动某日用户记录
     */
    ACTIVITY_DAY_USER,
    /**
     * 活动某天累计收集总数
     */
    ACTIVITY_DAY_TOTAL,
    /***
     * 活动每日是否已结算过
     */
    ACTIVITY_DAY_HAS_AWARD,
    /**
     * 暗拍场第一页的排名列表
     */
    SEALED_AUCTION_RANKING_FIRST_PAGE_LIST;


    private final String value;

    RedisCacheKey() {
        this.value = "AUCTION:" + SysUtil.getEnvironment().getValue() + ":CACHE:" + name();
    }

    @Override
    public String key() {
        return value;
    }

    public String key(Object... params) {
        StringBuilder key = new StringBuilder(value);
        if (params != null && params.length > 0) {
            for (Object param : params) {
                key.append(':');
                key.append(String.valueOf(param));
            }
        }
        return key.toString();
    }
}
