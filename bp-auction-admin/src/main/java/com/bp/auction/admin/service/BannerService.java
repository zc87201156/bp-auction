package com.bp.auction.admin.service;

import com.bp.auction.admin.dal.mapper.BannerMapper;
import com.bp.auction.common.constants.RedisCacheKey;
import com.bp.auction.common.dal.entity.Banner;
import com.bp.core.base.BaseServiceImpl;
import com.bp.core.cache.CacheKey;
import org.springframework.stereotype.Service;

import java.util.LinkedList;
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

}
