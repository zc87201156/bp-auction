package com.bp.auction.common.dal.entity;

import com.baomidou.mybatisplus.annotation.FieldStrategy;
import com.baomidou.mybatisplus.annotation.TableField;
import com.bp.core.annotation.Operator;
import com.bp.core.annotation.OperatorType;
import com.bp.core.base.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;

import java.util.Date;

/**
 * <p>
 * 违约用户表
 * </p>
 *
 * @author zc
 * @since 2019-02-18
 */
@Data
@EqualsAndHashCode(callSuper = true)
@Accessors(chain = true)
public class ViolationUser extends BaseEntity {

    private static final long serialVersionUID = 1L;

    /**
     * 用户id
     */
    private Long userId;

    /**
     * 违约时间
     */
    @TableField(strategy = FieldStrategy.IGNORED)
    @Operator
    private Date violationTime;

    /**
     * 违约拍卖id
     */
    @TableField(strategy = FieldStrategy.IGNORED)
    private Long violationAuctionId;

    /**
     * 保证金
     */
    @TableField(strategy = FieldStrategy.IGNORED)
    private Long bailAmount;

    /**
     * 违约拍卖商品名称
     */
    @TableField(strategy = FieldStrategy.IGNORED)
    private String goodsName;

    /***
     * 操作人
     */
    private String operator;

}
