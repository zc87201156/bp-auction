package com.bp.auction.server.service.bo;

import lombok.Data;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Date;

/**
 * 暗拍用户出价信息
 * @author zwf
 */
@Data
public class SealedAuctionInfo implements Serializable, Comparable<SealedAuctionInfo> {

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
     * 用户贵族等级
     */
    private Integer vipLevel;

    /**
     * 用户出价
     */
    private BigDecimal price;

    /**
     * 更新时间
     */
    private Date updateTime;

    public SealedAuctionInfo(Long userId, String nickname, String headImg, Integer vipLevel, BigDecimal price) {
        this.userId = userId;
        this.nickname = nickname;
        this.headImg = headImg;
        this.vipLevel = vipLevel;
        this.price = price;
        this.updateTime = new Date();
    }

    @Override
    public int compareTo(SealedAuctionInfo o) {
        //出价高的排在前面
/*        if (this.price > o.price) {
            return -1;
        }
        if (this.price < o.price) {
            return 1;
        }*/
        if(this.price.compareTo(o.getPrice()) == 1){
            return -1;
        }
        if(this.price.compareTo(o.getPrice()) == -1){
            return 1;
        }

        //出价一样的情况下，谁先出价谁排在前面
        if (this.updateTime.after(o.updateTime)) {
            return 1;
        }

        if (this.updateTime.before(o.updateTime)) {
            return -1;
        }
        return 0;
    }
}
