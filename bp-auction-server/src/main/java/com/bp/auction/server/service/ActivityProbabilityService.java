package com.bp.auction.server.service;

import com.bp.auction.common.constants.RedisCacheKey;
import com.bp.auction.common.dal.entity.ActivityProbability;
import com.bp.auction.server.dal.mapper.ActivityProbabilityMapper;
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
public class ActivityProbabilityService extends BaseServiceImpl<ActivityProbabilityMapper, ActivityProbability> {

    @Override
    protected void clearCache(ActivityProbability entity) {
        redisTemplate.delete(RedisCacheKey.ACTIVITY_PROBABILITY.key(entity.getActivityId()));
    }

    /***
     * 查询活动配置的概率信息
     * @param activityId
     * @return
     */
    public List<ActivityProbability> listProbability(long activityId) {
        return cache(RedisCacheKey.ACTIVITY_PROBABILITY.key(activityId), () -> baseMapper.listProbability(activityId));
    }
}
