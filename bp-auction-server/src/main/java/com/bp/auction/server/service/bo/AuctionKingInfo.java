package com.bp.auction.server.service.bo;

import lombok.Data;

import java.io.Serializable;

/**
 * 拍神榜信息
 * @author zwf
 */
@Data
public class AuctionKingInfo implements Serializable , Comparable<AuctionKingInfo> {
    private static final long serialVersionUID = 1L;

    /**
     * 用户id
     */
    private Long userId;

    /**
     * 用户昵称
     */
    private String nickname;

    /**
     * 用户头像
     */
    private String headImg;

    /**
     * 商品名称
     */
    private String goodsName;

    /**
     * 成交价格
     */
    private Double price;

    /**
     * 节省比例
     */
    private Double saveRate;

    /**
     * 奖品名称
     */
    private String awardName;

    /**
     * 更新时间
     */
    private Long updateTime;

    @Override
    public int compareTo(AuctionKingInfo o) {
        //节省比例大的排在前面
        if (this.saveRate > o.saveRate) {
            return -1;
        }
        if (this.saveRate < o.saveRate) {
            return 1;
        }
        //节省比例一样的情况下，谁先到谁排前面
        if (this.updateTime > o.updateTime) {
            return 1;
        }
        if (this.updateTime < o.updateTime) {
            return -1;
        }
        return 0;
    }
}
