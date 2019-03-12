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
public class Config extends BaseEntity {

    private static final long serialVersionUID = 1L;

    /**
     * 名称（英文唯一）
     */
    @Operator(OperatorType.LIKE)
    private String name;

    /**
     * 值
     */
    private String value;

    /**
     * 备注
     */
    private String remark;

    private Long channelId;




}
