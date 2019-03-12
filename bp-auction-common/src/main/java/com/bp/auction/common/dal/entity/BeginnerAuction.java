package com.bp.auction.common.dal.entity;

import java.math.BigDecimal;
import java.util.Date;
import com.bp.core.base.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;

/**
 * <p>
 * 新手引导专用拍卖
 * </p>
 *
 * @author zc
 * @since 2019-02-18
 */
@Data
@EqualsAndHashCode(callSuper = true)
@Accessors(chain = true)
public class BeginnerAuction extends BaseEntity {

    private static final long serialVersionUID = 1L;

    /**
     * 用户id
     */
    private Long userId;

    /**
     * 商品id
     */
    private Long goodsId;

    /**
     * 成交价
     */
    private BigDecimal price;

    /**
     * 成交时间
     */
    private Date endTime;

    /**
     * 竞拍次数
     */
    private Integer auctionTimes;

    /**
     * 商品名称
     */
    private String goodsName;

    /**
     * 默认商品图片
     */
    private String defaultGoodsImage;

    /**
     * 市场价
     */
    private BigDecimal marketPrice;

    /**
     * 起拍价
     */
    private BigDecimal startPrice;

    /**
     * 发货状态(1-待领取,2-审核中,3-已发放)
     */
    private Integer deliveryStatus;


}
