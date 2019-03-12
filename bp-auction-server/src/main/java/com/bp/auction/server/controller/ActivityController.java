package com.bp.auction.server.controller;

import com.bp.auction.common.dal.entity.Activity;
import com.bp.auction.server.controller.request.ActivityRequest;
import com.bp.auction.server.controller.response.ActivityRankRsp;
import com.bp.auction.server.controller.response.ActivityRsp;
import com.bp.auction.server.service.ActivityService;
import com.bp.auction.server.service.bo.ActivityUserInfo;
import com.bp.core.response.ResponseBean;
import com.bp.core.utils.type.DateUtils;
import com.bp.core.web.base.BaseController;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.collections.CollectionUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import java.util.Date;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/auction/api/activity")
public class ActivityController extends BaseController {

    @Autowired
    private ActivityService activityService;

    @RequestMapping("/info")
    public ResponseBean<ActivityRsp> info() {
        long userId = getUserId();
        List<Activity> list = activityService.listValidActivity();
        ActivityRsp rsp = new ActivityRsp();
        if (!CollectionUtils.isEmpty(list)) {
            Activity activity = list.get(0);
            Date now = new Date();
            //校验活动时间是否在范围内
            if (now.after(activity.getStartTime()) && now.before(activity.getEndTime())) {
                rsp.setActivityId(activity.getId());
                rsp.setName(activity.getName());
                long issue = Long.parseLong(DateUtils.formatDate(now, "yyyyMMdd"));
                ActivityUserInfo myUserInfo = activityService.getMyInfo(userId, activity.getId(), issue);
                rsp.setMyInfo(myUserInfo);
            }
        }
        return responseSuccess(rsp);
    }


    /***
     * 活动榜单
     * @return
     */

    @RequestMapping("/rank")
    public ResponseBean<ActivityRankRsp> rank(@RequestBody @Valid ActivityRequest activityRequest) {
        ActivityRankRsp rankRsp = new ActivityRankRsp();
        rankRsp.setActivityId(activityRequest.getActivityId());
        long userId = getUserId();
        long issue = Long.parseLong(DateUtils.formatDate(new Date(activityRequest.getDate()),"yyyyMMdd"));
        long nowIssue = Long.parseLong(DateUtils.formatDate(new Date(System.currentTimeMillis()),"yyyyMMdd"));
        //查询榜单用户
        List<ActivityUserInfo> userInfos = activityService.getActivityUserInfo(activityRequest.getActivityId(), issue);
        //只有查询当天实时的榜单，才需要单独查询并计算自己的信息
        if (nowIssue == issue) {
            ActivityUserInfo myInfo = null;
            if (!CollectionUtils.isEmpty(userInfos)) {
                for (ActivityUserInfo activityUserInfo : userInfos) {
                    if (activityUserInfo.getUserId() == userId) {
                        myInfo = activityUserInfo;
                        break;
                    }
                }
                //说明自己未在榜单里面
                if (myInfo == null) {
                    myInfo = activityService.getMyInfo(userId, activityRequest.getActivityId(), issue);
                }
            }
            rankRsp.setMyInfo(myInfo);
        }
        rankRsp.setRankList(userInfos);
        return responseSuccess(rankRsp);
    }
}
