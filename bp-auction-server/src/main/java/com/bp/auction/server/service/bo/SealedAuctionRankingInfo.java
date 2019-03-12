package com.bp.auction.server.service.bo;

import com.bp.auction.common.dal.entity.SealedAuctionRanking;
import lombok.Data;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Date;

/**
 * 暗拍定价排名
 * @author zwf
 */
@Data
public class SealedAuctionRankingInfo implements Serializable {

    private static final long serialVersionUID = 1L;

    private Long userId;

    private String nickname;

    private String headImg;

    private BigDecimal price;

    private Date auctionTime;

    public SealedAuctionRankingInfo(SealedAuctionRanking sar) {
        this.userId = sar.getUserId();
        this.nickname = sar.getNickname();
        this.headImg = sar.getHeadImg();
        this.price = sar.getPrice();
        this.auctionTime = sar.getAuctionTime();
    }


}
