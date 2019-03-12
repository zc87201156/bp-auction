package com.bp.auction.server.service.bo;

import lombok.Data;

import java.io.Serializable;
import java.math.BigDecimal;

@Data
public class MarqueeInfo implements Serializable {
    private static final long serialVersionUID = 1L;

    private String nickname;

    private String goodsName;

    private BigDecimal price;

    public MarqueeInfo(String nickname, String goodsName, BigDecimal price) {
        this.nickname = nickname;
        this.goodsName = goodsName;
        this.price = price;
    }
}
