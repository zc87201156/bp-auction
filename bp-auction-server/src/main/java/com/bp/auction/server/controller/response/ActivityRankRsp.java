package com.bp.auction.server.controller.response;

import com.bp.auction.server.service.bo.ActivityUserInfo;

import java.util.List;

/**
 * @author zc
 * @create 2019-01-22 16:48
 * @desc
 **/
public class ActivityRankRsp {
    private long activityId;//活动ID


    private ActivityUserInfo myInfo;

    private List<ActivityUserInfo> rankList;

    public long getActivityId() {
        return activityId;
    }

    public void setActivityId(long activityId) {
        this.activityId = activityId;
    }

    public ActivityUserInfo getMyInfo() {
        return myInfo;
    }

    public void setMyInfo(ActivityUserInfo myInfo) {
        this.myInfo = myInfo;
    }

    public List<ActivityUserInfo> getRankList() {
        return rankList;
    }

    public void setRankList(List<ActivityUserInfo> rankList) {
        this.rankList = rankList;
    }
}
