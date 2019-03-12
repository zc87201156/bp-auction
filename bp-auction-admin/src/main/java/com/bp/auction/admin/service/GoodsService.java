package com.bp.auction.admin.service;

import com.bp.auction.admin.dal.mapper.GoodsMapper;
import com.bp.auction.common.constants.RedisCacheKey;
import com.bp.auction.common.dal.entity.Goods;
import com.bp.core.base.BaseServiceImpl;
import com.bp.core.cache.CacheKey;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * <p>
 * 商品表 服务实现类
 * </p>
 *
 * @author zc
 * @since 2019-02-18
 */
@Service
public class GoodsService extends BaseServiceImpl<GoodsMapper, Goods> {

    @Override
    protected void clearCache(Goods entity) {
        if (entity != null && entity.getId() != null) {
            redisTemplate.delete(RedisCacheKey.GOODS_BY_ID.key(entity.getId()));
        }
    }

    /**
     * 获取指定id的商品
     *
     * @param id 商品id
     * @return
     */
    public Goods get(Long id) {
        return cache(RedisCacheKey.GOODS_BY_ID.key(id), () -> super.baseMapper.selectById(id), CacheKey.WEEK_1);
    }

    /**
     * 获取所有上架的商品
     *
     * @return
     */
    public List<Goods> getAll() {
        return super.baseMapper.getAll();
    }

}
