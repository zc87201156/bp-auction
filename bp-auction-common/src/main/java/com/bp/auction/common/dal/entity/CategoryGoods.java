package com.bp.auction.common.dal.entity;

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
public class CategoryGoods extends BaseEntity {

    private static final long serialVersionUID = 1L;

    /**
     * 场次ID
     */
    @Operator
    private Long categoryId;

    /**
     * 商品ID
     */
    @Operator
    private Long goodsId;

    /**
     * 排序
     */
    private Integer sort;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        CategoryGoods that = (CategoryGoods) o;
        return goodsId.equals(that.goodsId);
    }

    @Override
    public int hashCode() {
        return goodsId.hashCode();
    }


}
