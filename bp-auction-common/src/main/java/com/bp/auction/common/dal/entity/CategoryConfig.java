package com.bp.auction.common.dal.entity;

import com.bp.core.annotation.Operator;
import com.bp.core.annotation.OperatorType;
import com.bp.core.base.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;

/**
 * <p>
 * 
 * </p>
 *
 * @author zc
 * @since 2019-02-18
 */
@Data
@EqualsAndHashCode(callSuper = true)
@Accessors(chain = true)
public class CategoryConfig extends BaseEntity {

    private static final long serialVersionUID = 1L;

    /**
     * 场次名称
     */
    @Operator(OperatorType.LIKE)
    private String name;

    /**
     * 图片
     */
    private String img;

    /**
     * 状态 0-禁用 1-启用
     */
    @Operator
    private Integer enable;

    /**
     * 序号
     */
    private Integer sort;


}
