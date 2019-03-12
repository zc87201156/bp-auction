package com.bp.auction.common.dal.entity;

import java.math.BigDecimal;
import java.util.Date;
import com.bp.core.base.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;

/**
 * <p>
 * 暗拍场用户最终排名记录表
 * </p>
 *
 * @author zc
 * @since 2019-02-18
 */
@Data
@EqualsAndHashCode(callSuper = true)
@Accessors(chain = true)
public class SealedAuctionRanking extends BaseEntity {

    private static final long serialVersionUID = 1L;

    /**
     * 拍卖id
     */
    private Long auctionId;

    /**
     * 用户id
     */
    private Long userId;

    /**
     * 昵称
     */
    private String nickname;

    /**
     * 用户头像
     */
    private String headImg;

    /**
     * 用户出价
     */
    private BigDecimal price;

    /**
     * 排名
     */
    private Integer rank;

    /**
     * 出价时间
     */
    private Date auctionTime;


}
