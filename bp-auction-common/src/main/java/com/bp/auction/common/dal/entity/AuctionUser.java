package com.bp.auction.common.dal.entity;

import java.util.Date;
import com.bp.core.base.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;

/**
 * <p>
 * 用户的竞拍
 * </p>
 *
 * @author zc
 * @since 2019-02-18
 */
@Data
@EqualsAndHashCode(callSuper = true)
@Accessors(chain = true)
public class AuctionUser extends BaseEntity {

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
     * 拍卖成交人id
     */
    private Long winnerUserId;

    /**
     * 竞拍次数
     */
    private Integer auctionTimes;

    /**
     * 用户总共手续费
     */
    private Long totalAuctionFee;

    /**
     * 首次出价时间
     */
    private Date firstAuctionTime;

    /**
     * 最后一次出价时间
     */
    private Date lastAuctionTime;


}
