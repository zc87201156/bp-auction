package com.bp.auction.server.service;

import com.bp.auction.common.constants.RankType;
import com.bp.auction.common.constants.RedisCacheKey;
import com.bp.auction.common.dal.entity.RankAwardConfig;
import com.bp.auction.server.dal.mapper.RankAwardConfigMapper;
import com.bp.core.base.BaseServiceImpl;
import com.bp.core.cache.CacheKey;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * <p>
 * 榜单奖品配置
 * </p>
 *
 * @author zc
 * @since 2019-02-18
 */
@Service
public class RankAwardConfigService extends BaseServiceImpl<RankAwardConfigMapper, RankAwardConfig> {
    @Override
    protected void clearCache(RankAwardConfig entity) {
        if (entity != null && entity.getRankType() != null) {
            redisTemplate.delete(RedisCacheKey.RANK_AWARD_CONFIG.key(entity.getRankType()));
        }
    }

    /***
     * 根据榜单类型获取榜单奖励配置
     * @param rankType 榜单类型
     * @return
     */
    public List<RankAwardConfig> listByRankType(RankType rankType) {
        return cache(RedisCacheKey.RANK_AWARD_CONFIG.key(rankType.getValue()),
                () -> baseMapper.listByRankType(rankType.getValue()), CacheKey.MONTH_3);
    }

    /**
     * 获取指定榜单类型指定名次的奖励配置
     *
     * @param rankType 榜单类型
     * @param rank     排名
     * @return
     */
    public RankAwardConfig getByRank(RankType rankType, int rank) {
        for (RankAwardConfig config : listByRankType(rankType)) {
            if (config.getRankNum() == rank) {
                return config;
            }
        }
        return null;
    }
}
