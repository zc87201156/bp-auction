package com.bp.auction.server.service.bo;

import lombok.Data;

import java.io.Serializable;

/**
 *杠神榜信息
 */
@Data
public class AuctionKillerInfo implements Serializable {
    private static final long serialVersionUID = 1L;

    /**
     * 用户id
     */
    private Long userId;

    /**
     * 昵称
     */
    private String nickname;

    /**
     * 头像
     */
    private String headImg;

    /**
     * 累计抬价
     */
    private Long totalAuctionFee;

    /**
     * 奖品名称
     */
    private String awardName;

    /**
     * 奖品id
     */
    private Long awardConfigId;

}
