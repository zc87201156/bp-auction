package com.bp.auction.server.service;


import com.bp.auction.common.constants.ChannelConstants;
import com.bp.auction.common.constants.ConfigConstants;
import com.bp.auction.common.dal.entity.Config;
import com.bp.auction.server.dal.mapper.ConfigMapper;
import com.bp.core.base.BaseServiceImpl;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang.exception.ExceptionUtils;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * @author zc
 * @create 2019-02-15 20:16
 * @desc 配置项
 **/
@Slf4j
@Service
public class ConfigService extends BaseServiceImpl<ConfigMapper, Config> {
    private Map<String, Config> localCache = new ConcurrentHashMap<>();

    /**
     * 重新刷新某个渠道的配置项
     *
     * @param name 配置项名称
     */
    public void reload(String name) {
        Config config = baseMapper.findByName(name);
        if (config != null) {
            localCache.put(name, config);
        } else {
            localCache.remove(name);
        }
    }

    /**
     * 根据name获取配置项
     *
     * @param name
     * @return
     */
    public Config findByName(String name) {
        Config config = localCache.get(name);
        if (config == null) {
            config = baseMapper.findByName(name);
            if (config != null) {
                localCache.put(name, config);
            }
        }
        return config;
    }

    /**
     * 根据name获取配置项的值
     *
     * @param name
     * @param defValue
     * @param channel
     * @param <T>
     * @return
     */
    private <T> T getValueByName(String name, T defValue, Long channel) {
        try {
            Config config = findByName(name);
            if (config == null && !ChannelConstants.DEFAULT_CHANNEL.equals(channel)) {
                config = findByName(name);
            }
            if (config == null) {
                return defValue;
            }
            if (defValue instanceof Double) {
                return (T) Double.valueOf(config.getValue());
            }
            if (defValue instanceof String) {
                return (T) config.getValue();
            }
            if (defValue instanceof Float) {
                return (T) Float.valueOf(config.getValue());
            }
            if (defValue instanceof Integer) {
                return (T) Integer.valueOf(config.getValue());
            }
            if (defValue instanceof Long) {
                return (T) Long.valueOf(config.getValue());
            }
            if (defValue instanceof Boolean) {
                return (T) Boolean.valueOf(config.getValue());
            }
            return defValue;
        } catch (Exception e) {
            log.error("load config error:{}", ExceptionUtils.getStackTrace(e));
            return defValue;
        }
    }

    private String getStringValueByName(String name, Long channel) {
        return getValueByName(name, "", channel);
    }

    private String getStringValueByName(String name) {
        return getStringValueByName(name, ChannelConstants.DEFAULT_CHANNEL);
    }

    private double getDoubleValueByName(String name, Long channel) {
        return getValueByName(name, 0d, channel);
    }

    private double getDoubleValueByName(String name) {
        return getDoubleValueByName(name, ChannelConstants.DEFAULT_CHANNEL);
    }

    private float getFloatValueByName(String name, Long channel) {
        return getValueByName(name, 0f, channel);
    }

    private float getFloatValueByName(String name) {
        return getFloatValueByName(name, ChannelConstants.DEFAULT_CHANNEL);
    }

    private int getIntValueByName(String name, Long channel) {
        return getValueByName(name, 0, channel);
    }

    private int getIntValueByName(String name) {
        return getIntValueByName(name, ChannelConstants.DEFAULT_CHANNEL);
    }

    private long getLongValueByName(String name, Long channel) {
        return getValueByName(name, 0L, channel);
    }

    private long getLongValueByName(String name) {
        return getLongValueByName(name, ChannelConstants.DEFAULT_CHANNEL);
    }

    private boolean getBooleanValueByName(String name, Long channel) {
        return getValueByName(name, false, channel);
    }

    private boolean getBooleanValueByName(String name) {
        return getBooleanValueByName(name, ChannelConstants.DEFAULT_CHANNEL);
    }

    /**
     * 返回拍卖倒计时(单位：秒)
     *
     * @return
     */
    public int getAuctionCountDownSeconds() {
        return getIntValueByName(ConfigConstants.AUCTION_COUNT_DOWN_SECONDS);
    }

    /**
     * 某个商品往期拍卖查询返回的记录数量
     *
     * @return
     */
    public int getRecentAuctionNum() {
        return getIntValueByName(ConfigConstants.RECENT_AUCTION_NUM);
    }

    /**
     * 我的竞拍查询返回的记录数量
     *
     * @return
     */
    public int getMyAuctionNum() {
        return getIntValueByName(ConfigConstants.MY_AUCTION_NUM);
    }

    /**
     * 同时进行的最大拍卖数
     *
     * @return
     */
    public int getMaxAuctionNum() {
        return getIntValueByName(ConfigConstants.MAX_AUCTION_NUM);
    }

    /**
     * 每个拍卖线程处理的最大拍卖数
     *
     * @return
     */
    public int getThreadDealMaxAuctionNum() {
        return getIntValueByName(ConfigConstants.THREAD_DEAL_MAX_AUCTION_NUM);
    }

    /**
     * 拍卖定时任务线程池大小
     *
     * @return
     */
    public int getScheduledThreadPoolSize() {
        return getIntValueByName(ConfigConstants.SCHEDULED_THREAD_POOL_SIZE);
    }

    /**
     * 拍卖延迟支付秒数
     *
     * @return
     */
    public int getAuctionDelayPaymentSeconds() {
        return getIntValueByName(ConfigConstants.AUCTION_DELAY_PAYMENT_SECONDS);
    }

    /**
     * 锁定用户账户的秒数
     *
     * @return
     */
    public int getLockUserAccountSeconds() {
        return getIntValueByName(ConfigConstants.LOCK_USER_ACCOUNT_SECONDS);
    }

    /**
     * 控制开服停服等HTTP接口的密码
     *
     * @return
     */
    public String getServerAdminPassword() {
        return getStringValueByName(ConfigConstants.SERVER_ADMIN_PASSWORD);
    }

    /**
     * 服务器地址(包含域名及端口号)
     *
     * @return
     */
    public String getServerAddress() {
        return getStringValueByName(ConfigConstants.SERVER_ADDRESS);
    }

    /**
     * 某个拍卖出价记录查询返回的最大数量
     *
     * @return
     */
    public int getMaxAuctionHistoryNum() {
        return getIntValueByName(ConfigConstants.MAX_AUCTION_HISTORY_NUM);
    }

    /**
     * 跑马灯数量
     *
     * @return
     */
    public int getMarqueeNum() {
        return getIntValueByName(ConfigConstants.MARQUEE_NUM);
    }

    /**
     * 接口返回杠神榜前X名
     *
     * @return
     */
    public int getTopAuctionKillerRankingNum() {
        return getIntValueByName(ConfigConstants.TOP_AUCTION_KILLER_RANKING_NUM);
    }

    /**
     * 接口返回拍神榜前X名
     *
     * @return
     */
    public int getTopAuctionKingRankingNum() {
        return getIntValueByName(ConfigConstants.TOP_AUCTION_KING_RANKING_NUM);
    }

    /**
     * 判断为新小户的天数
     *
     * @return
     */
    public int getBeginnerJudgeDays() {
        return getIntValueByName(ConfigConstants.BEGINNER_JUDGE_DAYS);
    }

    /***
     * 用户最大同时托管场次数
     * @return
     */
    public int getUserMaxDeposit() {
        return getIntValueByName(ConfigConstants.USER_MAX_DEPOSIT);
    }

    /**
     * 小户的定义之二：最近一段时间(往前推N天)
     *
     * @return
     */
    public int getSmallUserDateRange() {
        return getIntValueByName(ConfigConstants.SMALL_USER_DATE_RANGE);
    }

    /**
     * 小户的定义之一：拍中的次数小于此值
     *
     * @return
     */
    public int getSmallUserAuctionSuccessTimes() {
        return getIntValueByName(ConfigConstants.SMALL_USER_AUCTION_SUCCESS_TIMES);
    }

    /**
     * 免手续费场保证金
     *
     * @return
     */
    public long getFreeAuctionFeeBailAmount() {
        return getLongValueByName(ConfigConstants.FREE_AUCTION_FEE_BAIL_AMOUNT);
    }

    /**
     * 暗拍定价排名列表每页显示的条数
     *
     * @return
     */
    public int getQuerySealedAuctionRankingPageSize() {
        return getIntValueByName(ConfigConstants.QUERY_SEALED_AUCTION_RANKING_PAGE_SIZE);
    }

    /**
     * 大厅列表中显示当前时间之后X分钟之内即将开始的滚拍
     *
     * @return
     */
    public int getAdvanceDisplayRollAuctionMinutes() {
        return getIntValueByName(ConfigConstants.ADVANCE_DISPLAY_ROLL_AUCTION_MINUTES);
    }

    /**
     * 暗拍提前X秒锁定用户出价，用于定价排名结算
     *
     * @return
     */
    public int getSealedAuctionSettlingSeconds() {

        int value = getIntValueByName(ConfigConstants.SEALED_AUCTION_SETTLING_SECONDS);
        //默认提前2秒
        return value <= 0 ? 2 : value;
    }
}
