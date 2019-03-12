package com.bp.auction.common.dal.entity;

import com.bp.core.base.BaseEntity;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;

import java.math.BigDecimal;
import java.util.Date;

/**
 * <p>
 * 拍卖记录表
 * </p>
 *
 * @author zc
 * @since 2019-02-18
 */
@Data
@EqualsAndHashCode(callSuper = true)
@Accessors(chain = true)
public class AuctionHistory extends BaseEntity {

    private static final long serialVersionUID = 1L;

    /**
     * 拍卖id
     */
    @JsonIgnore
    private Long auctionId;

    /**
     * 竞拍者id
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
     * 拍卖手续费
     */
    @JsonIgnore
    private Long auctionFee;

    /**
     * 拍前价格
     */
    @JsonIgnore
    private BigDecimal beforePrice;

    /**
     * 拍后价格
     */
    private BigDecimal afterPrice;

    /**
     * 竞价操作类型 0-自主操作 1-托管操作
     */
    @JsonIgnore
    private Integer operateType;

    public AuctionHistory() {
    }

    public AuctionHistory(Long id, Long auctionId, Long userId, String nickname, String headImg, Integer vipLevel,
                          Long auctionFee, BigDecimal beforePrice, BigDecimal afterPrice, Integer operateType,
                          long createTime) {
        setId(id);
        this.auctionId = auctionId;
        this.userId = userId;
        this.nickname = nickname;
        this.headImg = headImg;
        this.vipLevel = vipLevel;
        this.auctionFee = auctionFee;
        this.beforePrice = beforePrice;
        this.afterPrice = afterPrice;
        this.operateType = operateType;
        setCreateTime(new Date(createTime));
    }
}
