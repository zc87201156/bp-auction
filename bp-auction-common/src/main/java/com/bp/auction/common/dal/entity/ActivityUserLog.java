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
public class ActivityUserLog extends BaseEntity {

    private static final long serialVersionUID = 1L;

    /**
     * 活动ID
     */
    @Operator(value = OperatorType.EQ)
    private Long activityId;

    /**
     * 期次 每日日期号
     */
    @Operator(value = OperatorType.EQ)
    private Long issue;

    /**
     * 用户ID
     */
    @Operator(value = OperatorType.EQ)
    private Long userId;

    /**
     * 用户集齐活动元素数量
     */
    private Long num;

    /**
     * 奖励数量
     */
    private Long awardNum;

    /**
     * 如果用户上当日榜,代表榜单名次
     */
    private Integer rankNum;

    /**
     * 奖励发放状态 0-未发放 1-已发放
     */
    private Integer awardStatus;


}
