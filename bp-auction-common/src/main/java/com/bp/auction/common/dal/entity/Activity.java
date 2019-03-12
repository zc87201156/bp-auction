package com.bp.auction.common.dal.entity;

import java.util.Date;

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
public class Activity extends BaseEntity {

    private static final long serialVersionUID = 1L;

    /**
     * 活动名称
     */
    @Operator(OperatorType.LIKE)
    private String name;

    /**
     * 奖励总数量
     */
    private Long awardNum;

    /**
     * 活动开始时间
     */
    private Date startTime;

    /**
     * 活动结束时间
     */
    private Date endTime;

    /**
     * 启用状态 0-禁用 1-启用
     */
    @Operator(OperatorType.EQ)
    private Integer enable;

    /**
     * 榜单取多少名
     */
    private Integer rankNum;


}
