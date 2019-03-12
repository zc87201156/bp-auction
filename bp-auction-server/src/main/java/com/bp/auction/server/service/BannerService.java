package com.bp.auction.server.service;

import com.bp.auction.common.constants.RedisCacheKey;
import com.bp.auction.common.dal.entity.Banner;
import com.bp.auction.server.dal.mapper.BannerMapper;
import com.bp.core.base.BaseServiceImpl;
import com.bp.core.cache.CacheKey;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * <p>
 * banner图 服务实现类
 * </p>
 *
 * @author zc
 * @since 2019-02-18
 */
@Service
public class BannerService extends BaseServiceImpl<BannerMapper, Banner> {

    @Override
    protected void clearCache(Banner entity) {
        redisTemplate.delete(RedisCacheKey.BANNER_LIST.key());
    }

    /***
     * 获取启用的banner图列表
     * @return
     */
    public List<Banner> listBanners() {
        return cache(RedisCacheKey.BANNER_LIST.key(), () -> baseMapper.listBanners(), CacheKey.WEEK_1);
    }
}
