package com.bp.auction.admin.dal.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.bp.auction.common.dal.entity.CategoryConfig;

import java.util.List;

/**
 * <p>
 * Mapper 接口
 * </p>
 *
 * @author zc
 * @since 2019-02-18
 */
public interface CategoryConfigMapper extends BaseMapper<CategoryConfig> {
    List<CategoryConfig> listCategory();
}
