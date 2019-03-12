package com.bp.auction.admin.dal.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.bp.auction.common.dal.entity.ActivityProbability;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * <p>
 *  Mapper 接口
 * </p>
 *
 * @author zc
 * @since 2019-02-18
 */
public interface ActivityProbabilityMapper extends BaseMapper<ActivityProbability> {

    List<ActivityProbability> listProbability(@Param("activityId") long activityId);

}
