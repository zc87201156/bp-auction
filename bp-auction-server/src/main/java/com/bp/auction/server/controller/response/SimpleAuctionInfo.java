package com.bp.auction.server.controller.response;

import com.bp.auction.server.service.bo.AuctionInfo;

import java.math.BigDecimal;

/**
 * @author wcq
 * @version $Id: SimpleAuctionInfo.java, v0.1 2019/2/19 Exp $$
 */
public class SimpleAuctionInfo {

    private Long id;
    private String defaultGoodsImage;
    private String goodsName;
    private BigDecimal currentPrice;
    private String nickname;
    private Integer auctionStatus;
    private Long startTime;
    private Long endTime;
    private Integer auctionUserCount;
    private Integer auctionClass;

    public SimpleAuctionInfo(AuctionInfo auctionInfo) {
        this(auctionInfo, null);
    }

    public SimpleAuctionInfo(AuctionInfo auctionInfo, Integer auctionUserCount) {
        this.id = auctionInfo.getId();
        this.defaultGoodsImage = auctionInfo.getDefaultGoodsImage();
        this.goodsName = auctionInfo.getGoodsName();
        this.currentPrice = auctionInfo.getCurrentPrice();
        this.nickname = auctionInfo.getNickname();
        this.auctionStatus = auctionInfo.getAuctionStatus().getValue();
        this.startTime = auctionInfo.getStartTime().getTime();
        if (auctionInfo.getEndTime() != null) {
            this.endTime = auctionInfo.getEndTime().getTime();
        }
        this.auctionUserCount = auctionUserCount;
        this.auctionClass = auctionInfo.getAuctionClass().getValue();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDefaultGoodsImage() {
        return defaultGoodsImage;
    }

    public void setDefaultGoodsImage(String defaultGoodsImage) {
        this.defaultGoodsImage = defaultGoodsImage;
    }

    public String getGoodsName() {
        return goodsName;
    }

    public void setGoodsName(String goodsName) {
        this.goodsName = goodsName;
    }

    public BigDecimal getCurrentPrice() {
        return currentPrice;
    }

    public void setCurrentPrice(BigDecimal currentPrice) {
        this.currentPrice = currentPrice;
    }

    public String getNickname() {
        return nickname;
    }

    public void setNickname(String nickname) {
        this.nickname = nickname;
    }

    public Integer getAuctionStatus() {
        return auctionStatus;
    }

    public void setAuctionStatus(Integer auctionStatus) {
        this.auctionStatus = auctionStatus;
    }

    public Long getStartTime() {
        return startTime;
    }

    public void setStartTime(Long startTime) {
        this.startTime = startTime;
    }

    public Long getEndTime() {
        return endTime;
    }

    public void setEndTime(Long endTime) {
        this.endTime = endTime;
    }

    public Integer getAuctionUserCount() {
        return auctionUserCount;
    }

    public void setAuctionUserCount(Integer auctionUserCount) {
        this.auctionUserCount = auctionUserCount;
    }

    public Integer getAuctionClass() {
        return auctionClass;
    }

    public void setAuctionClass(Integer auctionClass) {
        this.auctionClass = auctionClass;
    }
}
