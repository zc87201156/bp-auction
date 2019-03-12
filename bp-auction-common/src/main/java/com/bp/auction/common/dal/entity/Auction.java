package com.bp.auction.common.dal.entity;

import java.math.BigDecimal;
import java.util.Date;

import com.baomidou.mybatisplus.annotation.TableField;
import com.bp.core.annotation.Operator;
import com.bp.core.annotation.OperatorType;
import com.bp.core.base.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;

/**
 * <p>
 * 拍卖表
 * </p>
 *
 * @author zc
 * @since 2019-02-18
 */
@Data
@EqualsAndHashCode(callSuper = true)
@Accessors(chain = true)
public class Auction extends BaseEntity {

    private static final long serialVersionUID = 1L;

    /**
     * 商品id
     */
    @Operator
    private Long goodsId;

    /**
     * 起拍时间
     */
    private Date startTime;

    /**
     * 拍卖结束时间
     */
    private Date endTime;

    /**
     * 当前竞价
     */
    private BigDecimal currentPrice;

    /**
     * 最新出价人
     */
    @Operator
    private Long currentUserId;

    /**
     * 当前出价人昵称
     */
    private String nickname;

    /**
     * 当前出价人头像
     */
    private String headImg;

    /**
     * 当前出价人贵族等级
     */
    private Integer vipLevel;

    /**
     * 当前出价人所在城市
     */
    private String city;

    /**
     * 付款截止时间
     */
    private Date paymentEndTime;

    /**
     * 拍卖状态(0-拍卖未开始，1-拍卖中，2-成交，3-流拍)
     */
    @Operator
    private Integer auctionStatus;

    /**
     * 支付状态(0-未支付，1-已支付)
     */
    private Integer paymentStatus;

    /**
     * 支付订单号
     */
    @Operator(OperatorType.LIKE)
    private String paymentOrderNo;

    /**
     * 支付时间
     */
    private Date paymentTime;

    /**
     * 发货状态(1-待领取,2-审核中,3-已发放)
     */
    private Integer deliveryStatus;

    /**
     * 排序
     */
    private Integer sort;

    /**
     * 下一期拍卖id
     */
    private Long nextId;

    /**
     * 是否启用：(0-禁用，1-启用)
     */
    @Operator
    private Integer enable;

    /**
     * 拍卖类型 0-手动拍卖 1-滚动拍卖
     */
    @Operator
    private Integer type;

    /**
     * 如果是滚拍，代表滚拍配置ID
     */
    private Long rollAuctionId;

    /**
     * 场次类型(0-普通场,1-新手场,2-小户场,3-免手续费场)
     */
    @Operator
    private Integer auctionClass;

    /**
     * 该场次是否支持托管 0-否 1-是
     */
    private Integer canDeposit;

    /**
     * 免手续费场的报名费
     */
    private Long freeEntryFee;

    /**
     * 免手续费场的加价幅度
     */
    private BigDecimal freeRaisePrice;

    /**
     * 操作人
     */
    private String operator;

    /**
     * 环境(0-线上环境，1-灰度环境)
     */
    @Operator
    private Integer environment;

    /**
     * 分页指定ID查询的字段
     */
    @Operator(targetFiled = "id")
    @TableField(exist = false)
    private Long searchById;

}
