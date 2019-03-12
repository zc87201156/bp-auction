package com.bp.auction.common.dal.entity;

import java.math.BigDecimal;

import com.bp.core.annotation.Operator;
import com.bp.core.annotation.OperatorType;
import com.bp.core.base.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;

/**
 * <p>
 * 商品表
 * </p>
 *
 * @author zc
 * @since 2019-02-18
 */
@Data
@EqualsAndHashCode(callSuper = true)
@Accessors(chain = true)
public class Goods extends BaseEntity {

    private static final long serialVersionUID = 1L;

    /**
     * 商品编号
     */
    @Operator(OperatorType.LIKE)
    private String no;

    /**
     * 商品名称
     */
    @Operator(OperatorType.LIKE)
    private String name;

    /**
     * 默认图片
     */
    private String defaultImage;

    /**
     * 商品轮播图片列表(逗号隔开)
     */
    private String images;

    /**
     * 市场价格
     */
    private BigDecimal marketPrice;

    /**
     * 起拍价格(单价元)
     */
    private BigDecimal startPrice;

    /**
     * 拍卖手续费id
     */
    private Long auctionFeeId;

    /**
     * 平台商品id(支付创建订单时需要)
     */
    private Long platProductId;

    /**
     * 是否上架(0-下架，1-上架)
     */
    @Operator
    private Integer enable;

    /**
     * 操作人
     */
    private String operator;


}
