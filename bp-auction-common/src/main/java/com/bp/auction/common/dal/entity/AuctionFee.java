package com.bp.auction.common.dal.entity;

import java.math.BigDecimal;

import com.bp.core.annotation.Operator;
import com.bp.core.base.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;

/**
 * <p>
 * 拍卖手续费配置表
 * </p>
 *
 * @author zc
 * @since 2019-02-18
 */
@Data
@EqualsAndHashCode(callSuper = true)
@Accessors(chain = true)
public class AuctionFee extends BaseEntity {

    private static final long serialVersionUID = 1L;

    /**
     * 拍卖手续费
     */
    @Operator
    private Long fee;

    /**
     * 竞拍上涨价格(单位元)
     */
    @Operator
    private BigDecimal price;

    /**
     * 状态(0-禁用，1-启用)
     */
    private Integer enable;


}
