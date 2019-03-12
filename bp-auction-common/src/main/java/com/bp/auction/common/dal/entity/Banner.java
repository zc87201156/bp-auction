package com.bp.auction.common.dal.entity;

import com.baomidou.mybatisplus.annotation.FieldStrategy;
import com.baomidou.mybatisplus.annotation.TableField;
import com.bp.core.annotation.Operator;
import com.bp.core.base.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;

/**
 * <p>
 * banner图
 * </p>
 *
 * @author zc
 * @since 2019-02-18
 */
@Data
@EqualsAndHashCode(callSuper = true)
@Accessors(chain = true)
public class Banner extends BaseEntity {

    private static final long serialVersionUID = 1L;

    /**
     * 图片
     */
    private String image;

    /**
     * 链接
     */
    @TableField(strategy = FieldStrategy.IGNORED)
    private String link;

    /**
     * 排序
     */
    private Integer sort;
    /**
     * 状态(0-禁用,1-启用)
     */
    @Operator
    private Integer enable;
}
