package com.bp.auction.common.service.bo;

import java.io.Serializable;

/**
 * @author zc
 * @create 2018-12-14 15:09
 * @desc
 **/
public class DepositUserInfo implements Serializable {
    private static final long serialVersionUID = 1L;
    private Long userId;
    //下期是否自动托管
    private int isAutoNext;
    //出价时间间隔(s)
    private int auctionPeriod;
    //出价上限
    private long auctionFeeLimit;
    //当前已经自动出价次数
    private int currentAuctionTimes;
    //当前累计已出手续费总额
    private long currentFee;
    //渠道ID
    private long channelId;
    //用户城市
    private String city;

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public int getIsAutoNext() {
        return isAutoNext;
    }

    public void setIsAutoNext(int isAutoNext) {
        this.isAutoNext = isAutoNext;
    }

    public int getAuctionPeriod() {
        return auctionPeriod;
    }

    public void setAuctionPeriod(int auctionPeriod) {
        this.auctionPeriod = auctionPeriod;
    }

    public long getAuctionFeeLimit() {
        return auctionFeeLimit;
    }

    public void setAuctionFeeLimit(long auctionFeeLimit) {
        this.auctionFeeLimit = auctionFeeLimit;
    }

    public int getCurrentAuctionTimes() {
        return currentAuctionTimes;
    }

    public void setCurrentAuctionTimes(int currentAuctionTimes) {
        this.currentAuctionTimes = currentAuctionTimes;
    }

    public long getCurrentFee() {
        return currentFee;
    }

    public void setCurrentFee(long currentFee) {
        this.currentFee = currentFee;
    }

    public long getChannelId() {
        return channelId;
    }

    public void setChannelId(long channelId) {
        this.channelId = channelId;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }
}
