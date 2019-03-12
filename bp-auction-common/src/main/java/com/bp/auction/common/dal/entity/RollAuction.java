package com.bp.auction.common.dal.entity;

import java.math.BigDecimal;
import java.util.Date;

import com.bp.core.annotation.Operator;
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
public class RollAuction extends BaseEntity {

    private static final long serialVersionUID = 1L;

    /**
     * 滚拍类型(0-普通滚拍，1-新小户滚拍, 2-小户场滚拍 3-免手续费场)
     */
    @Operator
    private Integer type;

    /**
     * 关联场次ID
     */
    @Operator
    private Long categoryId;

    /**
     * 滚拍每期时间间隔（单位秒)
     */
    private Integer period;
    /***
     * 滚拍开始时间
     */
    private java.sql.Time startTime;
    /***
     * 滚拍结束时间
     */
    private java.sql.Time endTime;

    /**
     * 0-禁用 1-启用
     */
    @Operator
    private Integer enable;

    /**
     * 滚拍状态 0-未终止 1-已终止
     */
    private Integer status;

    /**
     * 滚拍序值
     */
    private Integer sort;

    /**
     * 操作人
     */
    private String operator;

    /**
     * 当前已经生成的最新一期拍卖期次
     */
    private Long currentAuctionId;

    /**
     * 当前生成最新那期商品ID
     */
    private Long currentGoodsId;

    /**
     * 当前第几轮
     */
    private Integer currentTurn;

    /**
     * 滚拍轮数 -1代表不限
     */
    private Integer turns;

    /**
     * 该场次是否支持托管 0-否 1-是
     */
    private Integer canDeposit;

    /**
     * 环境(0-线上环境，1-灰度环境)
     */
    @Operator
    private Integer environment;

    /**
     * 免手续费场入场费
     */
    private Long freeEntryFee;

    /**
     * 免手续费场加价幅度
     */
    private BigDecimal freeRaisePrice;


}
