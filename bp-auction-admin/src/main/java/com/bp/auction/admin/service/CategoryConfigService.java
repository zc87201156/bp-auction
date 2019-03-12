package com.bp.auction.admin.service;

import com.bp.auction.admin.dal.mapper.CategoryConfigMapper;
import com.bp.auction.common.constants.RedisCacheKey;
import com.bp.auction.common.dal.entity.CategoryConfig;
import com.bp.core.base.BaseServiceImpl;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * <p>
 * 服务实现类
 * </p>
 *
 * @author zc
 * @since 2019-02-18
 */
@Service
public class CategoryConfigService extends BaseServiceImpl<CategoryConfigMapper, CategoryConfig> {
    public List<CategoryConfig> listCategory() {
        return cache(RedisCacheKey.CATEGORY_LIST.key(), () -> baseMapper.listCategory());
    }
}
