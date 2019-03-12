package com.bp.auction.common.dal.entity;

import com.bp.auction.common.constants.Attribute;
import com.bp.core.base.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;

/**
 * <p>
 * 拍卖属性表
 * </p>
 *
 * @author zc
 * @since 2019-02-18
 */
@Data
@EqualsAndHashCode(callSuper = true)
@Accessors(chain = true)
public class AuctionAttribute extends BaseEntity {

    private static final long serialVersionUID = 1L;

    /**
     * 拍卖id
     */
    private Long auctionId;

    /**
     * 属性
     */
    private Integer attribute;

    /**
     * 属性类型(1-string,2-int,3-long,4-double,5-float)
     */
    private Integer type;

    /**
     * 属性值
     */
    private String value;

    public AuctionAttribute() {
    }

    public AuctionAttribute(long auctionId, Attribute attribute, Object value) {
        this.auctionId = auctionId;
        this.attribute = attribute.getValue();
        this.type = attribute.getType().getValue();
        if (value != null) {
            this.value = value.toString();
        }
    }
}
