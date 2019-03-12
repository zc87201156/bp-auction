package com.bp.auction.admin.service;

import com.bp.auction.admin.dal.mapper.CategoryGoodsMapper;
import com.bp.auction.common.constants.RedisCacheKey;
import com.bp.auction.common.dal.entity.CategoryGoods;

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
public class CategoryGoodsService extends BaseServiceImpl<CategoryGoodsMapper, CategoryGoods> {
    @Override
    protected void clearCache(CategoryGoods entity) {
        redisTemplate.delete(RedisCacheKey.CATEGORY_GOODS_LIST.key(entity.getCategoryId()));
    }

    /***
     * 查询某个场次下的所有商品
     * @param categoryId
     * @return
     */
    public List<CategoryGoods> listGoods(long categoryId) {
        return cache(RedisCacheKey.CATEGORY_GOODS_LIST.key(categoryId), () -> baseMapper.listGoods(categoryId));
    }

    /***
     * 删除记录
     * @param entity
     */
    public void deleteRecord(CategoryGoods entity){
        delete(entity);
    }

}
