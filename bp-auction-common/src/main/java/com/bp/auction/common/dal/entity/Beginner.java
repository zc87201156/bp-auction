package com.bp.auction.common.dal.entity;

import java.util.Date;
import com.bp.core.base.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;

/**
 * <p>
 * 新手表
 * </p>
 *
 * @author zc
 * @since 2019-02-18
 */
@Data
@EqualsAndHashCode(callSuper = true)
@Accessors(chain = true)
public class Beginner extends BaseEntity {

    private static final long serialVersionUID = 1L;

    /**
     * 用户id
     */
    private Long userId;

    /**
     * 首次出价时间
     */
    private Date firstAuctionTime;

    /**
     * 拍中总次数
     */
    private Integer totalAuctionSuccessTimes;

    /**
     * 最后拍中时间
     */
    private Date lastAuctionSuccessDate;


}
