package com.bp.auction.server.service;

import com.bp.auction.common.constants.RedisCacheKey;
import com.bp.auction.common.dal.entity.AuctionFee;
import com.bp.auction.server.dal.mapper.AuctionFeeMapper;
import com.bp.core.base.BaseServiceImpl;
import com.bp.core.cache.CacheKey;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;

/**
 * <p>
 * 拍卖手续费配置表 服务实现类
 * </p>
 *
 * @author zc
 * @since 2019-02-18
 */
@Service
public class AuctionFeeService extends BaseServiceImpl<AuctionFeeMapper, AuctionFee> {
    @Override
    protected void clearCache(AuctionFee entity) {
        redisTemplate.delete(RedisCacheKey.ALL_AUCTION_FEES.key());
    }

    public List<AuctionFee> getAll() {
        return cache(RedisCacheKey.ALL_AUCTION_FEES.key(), () -> baseMapper.getAll(), CacheKey.MONTH_3);
    }

    /**
     * 获取指定id的手续费配置
     *
     * @param id 手续费配置id
     * @return
     */
    public AuctionFee get(Long id) {
        for (AuctionFee fee : getAll()) {
            if (Objects.equals(fee.getId(), id)) {
                return fee;
            }
        }
        return null;
    }

    /**
     * 从数据库中获取指定id的手续费配置
     *
     * @param id 手续费配置id
     * @return
     */
    public AuctionFee load(Long id) {
        return baseMapper.selectById(id);
    }
}
