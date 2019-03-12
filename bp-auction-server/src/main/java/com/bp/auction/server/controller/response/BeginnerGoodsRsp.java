package com.bp.auction.server.controller.response;


import com.bp.auction.common.dal.entity.BeginnerGoods;

import java.math.BigDecimal;

/**
 * @author zwf
 */
public class BeginnerGoodsRsp {

    private String name;

    private String defaultImage;

    private BigDecimal marketPrice;

    private BigDecimal startPrice;

    private Long auctionFee;

    private BigDecimal auctionFeePrice;

    public BeginnerGoodsRsp(BeginnerGoods bg) {
        this.name = bg.getName();
        this.defaultImage = bg.getDefaultImage();
        this.marketPrice = bg.getMarketPrice();
        this.startPrice = bg.getStartPrice();
        this.auctionFee = bg.getAuctionFee();
        this.auctionFeePrice = bg.getAuctionFeePrice();
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDefaultImage() {
        return defaultImage;
    }

    public void setDefaultImage(String defaultImage) {
        this.defaultImage = defaultImage;
    }

    public BigDecimal getMarketPrice() {
        return marketPrice;
    }

    public void setMarketPrice(BigDecimal marketPrice) {
        this.marketPrice = marketPrice;
    }

    public BigDecimal getStartPrice() {
        return startPrice;
    }

    public void setStartPrice(BigDecimal startPrice) {
        this.startPrice = startPrice;
    }

    public Long getAuctionFee() {
        return auctionFee;
    }

    public void setAuctionFee(Long auctionFee) {
        this.auctionFee = auctionFee;
    }

    public BigDecimal getAuctionFeePrice() {
        return auctionFeePrice;
    }

    public void setAuctionFeePrice(BigDecimal auctionFeePrice) {
        this.auctionFeePrice = auctionFeePrice;
    }
}
