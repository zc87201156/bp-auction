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
public class ActivityProbability extends BaseEntity {

    private static final long serialVersionUID = 1L;

    /**
     * 活动Id
     */
    @Operator(OperatorType.EQ)
    private Long activityId;

    /**
     * 已出现数量
     */
    private Integer num;

    /**
     * 概率
     */
    private Double probability;


}
