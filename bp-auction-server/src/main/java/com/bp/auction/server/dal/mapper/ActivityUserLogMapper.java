package com.bp.auction.server.dal.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.bp.auction.common.dal.entity.ActivityUserLog;
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
public interface ActivityUserLogMapper extends BaseMapper<ActivityUserLog> {

    ActivityUserLog getUserLog(@Param("activityId") long activityId, @Param("issue") long issue, @Param("userId") long userId);

    /**
     * 批量保存
     * @param list
     */
    void batchInsert(List<ActivityUserLog> list);

}
