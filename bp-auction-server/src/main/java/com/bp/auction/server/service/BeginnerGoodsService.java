package com.bp.auction.server.service;

import com.bp.auction.common.constants.RedisCacheKey;
import com.bp.auction.common.dal.entity.BeginnerGoods;
import com.bp.auction.server.dal.mapper.BeginnerGoodsMapper;
import com.bp.core.base.BaseServiceImpl;
import com.bp.core.cache.CacheKey;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * <p>
 * 新手引导专用商品 服务实现类
 * </p>
 *
 * @author zc
 * @since 2019-02-20
 */
@Service
public class BeginnerGoodsService extends BaseServiceImpl<BeginnerGoodsMapper, BeginnerGoods> {

    @Override
    protected void clearCache(BeginnerGoods entity) {
        redisTemplate.delete(RedisCacheKey.ALL_BEGINNER_GOODS.key());
    }

    /**
     * 获取所有的新手商品
     * @return
     */
    public List<BeginnerGoods> getAll() {
        return cache(RedisCacheKey.ALL_BEGINNER_GOODS.key(), () -> baseMapper.getAll(), CacheKey.MONTH_3);
    }

    public BeginnerGoods getDefault() {
        List<BeginnerGoods> allGoods = getAll();
        return allGoods.isEmpty() ? null : allGoods.get(0);
    }
}
