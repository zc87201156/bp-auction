package com.bp.auction.server.service;

import com.bp.auction.common.dal.entity.ActivityUserLog;
import com.bp.auction.server.dal.mapper.ActivityUserLogMapper;
import com.bp.core.base.BaseServiceImpl;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * <p>
 * 活动用户日志
 * </p>
 *
 * @author zc
 * @since 2019-02-18
 */
@Service
public class ActivityUserLogService extends BaseServiceImpl<ActivityUserLogMapper, ActivityUserLog> {

    public ActivityUserLog getUserLog(long activityId, long issue, long userId) {
        return baseMapper.getUserLog(activityId, issue, userId);
    }

    /**
     * 批量保存活动用户日志
     *
     * @param list
     */
    public void batchInsert(List<ActivityUserLog> list) {
        if (CollectionUtils.isEmpty(list)) {
            return;
        }
        List<ActivityUserLog> tmpList = new ArrayList<>();
        Date now = new Date();
        for (ActivityUserLog userLog : list) {
            userLog.setCreateTime(now);
            userLog.setDeleteFlag(0);
            tmpList.add(userLog);
            //每100个保存一次
            if (tmpList.size() % 100 == 0) {
                saveBatch(tmpList);
                tmpList.clear();
            }
        }
        if (!tmpList.isEmpty()) {
            saveBatch(tmpList);
        }
    }
}
