package com.bp.auction.common.dal.entity;

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
public class RankAwardLog extends BaseEntity {

    private static final long serialVersionUID = 1L;

    /**
     * 榜单类型 1-杠神榜 2-拍神榜
     */
    private Integer rankType;

    /**
     * 榜单期次号
     */
    private Integer rankIssue;

    private Long userId;

    /**
     * 榜单名次
     */
    private Integer rankNum;

    /**
     * 奖励配置ID
     */
    private Long awardConfigId;

    /**
     * 状态 0-未发放 1-待领取 2-审核中 3-已发放
     */
    private Integer status;


}
