package com.bp.auction.common.dal.entity;

import java.util.Date;
import com.bp.core.base.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;

/**
 * <p>
 * 违约用户记录
 * </p>
 *
 * @author zc
 * @since 2019-02-18
 */
@Data
@EqualsAndHashCode(callSuper = true)
@Accessors(chain = true)
public class ViolationUserLog extends BaseEntity {

    private static final long serialVersionUID = 1L;

    /**
     * 用户id
     */
    private Long userId;

    /**
     * 拍卖id
     */
    private Long auctionId;

    /**
     * 拍卖开始时间
     */
    private Date startTime;

    /**
     * 商品名称
     */
    private String goodsName;

    /**
     * 支付截止时间
     */
    private Date paymentEndTime;

    /**
     * 支付状态(0-未支付，1-已支付)
     */
    private Integer paymentStatus;

    /**
     * 支付时间
     */
    private Date paymentTime;

    /**
     * 处理状态(0-未处理，1-已处理)
     */
    private Integer processed;

    /**
     * 处理时间
     */
    private Date processTime;


}
