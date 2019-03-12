package com.bp.auction.server.controller.request;

import javax.validation.constraints.NotNull;

/**
 * @author zc
 * @create 2018-12-20 22:00
 * @desc 托管请求
 **/
public class DepositRequest {
    @NotNull(message="拍卖ID不能为空")
    private long auctionId ;
    //true-取消托管 false-设置托管
    @NotNull(message="是否是托管不能为空")
    private boolean cancel ;
    //是否自动下一期
    private int isAutoNext ;
    //出价间隔
    private int auctionPeriod ;
    //出价限额
    private long auctionLimit ;
    //用户所在城市
    private String city;

    public long getAuctionId() {
        return auctionId;
    }

    public void setAuctionId(long auctionId) {
        this.auctionId = auctionId;
    }

    public boolean isCancel() {
        return cancel;
    }

    public void setCancel(boolean cancel) {
        this.cancel = cancel;
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

    public long getAuctionLimit() {
        return auctionLimit;
    }

    public void setAuctionLimit(long auctionLimit) {
        this.auctionLimit = auctionLimit;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }
}
