package com.bp.auction.server.controller.response;

import com.bp.auction.server.service.bo.ActivityUserInfo;

/**
 * @author zc
 * @create 2019-01-24 19:47
 * @desc
 **/
public class ActivityRsp {
    private Long activityId;//活动ID

    private String name;//活动名称

    private ActivityUserInfo myInfo;//我参与此活动的记录

    public Long getActivityId() {
        return activityId;
    }

    public void setActivityId(Long activityId) {
        this.activityId = activityId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public ActivityUserInfo getMyInfo() {
        return myInfo;
    }

    public void setMyInfo(ActivityUserInfo myInfo) {
        this.myInfo = myInfo;
    }
}
