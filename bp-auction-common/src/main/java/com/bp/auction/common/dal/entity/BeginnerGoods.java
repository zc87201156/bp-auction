package com.bp.auction.common.dal.entity;

import java.math.BigDecimal;
import com.bp.core.base.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;

/**
 * <p>
 * 新手引导专用商品
 * </p>
 *
 * @author zc
 * @since 2019-02-20
 */
@Data
@EqualsAndHashCode(callSuper = true)
@Accessors(chain = true)
public class BeginnerGoods extends BaseEntity {

    private static final long serialVersionUID = 1L;

    /**
     * 商品名称
     */
    private String name;

    /**
     * 默认图片
     */
    private String defaultImage;

    /**
     * 市场价格
     */
    private BigDecimal marketPrice;

    /**
     * 起拍价格
     */
    private BigDecimal startPrice;

    /**
     * 手续费
     */
    private Long auctionFee;

    /**
     * 手续费抬价
     */
    private BigDecimal auctionFeePrice;

    /**
     * 平台商品id
     */
    private Long platProductId;


}
