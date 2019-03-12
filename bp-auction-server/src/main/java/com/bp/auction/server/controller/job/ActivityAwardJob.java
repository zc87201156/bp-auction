package com.bp.auction.server.controller.job;

import com.bp.auction.server.service.ActivityService;
import com.bp.core.utils.type.DateUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Date;

/**
 * Created with IDEA
 * Author:qyl
 * Date:2019/2/22
 * Time:14:40
 * Desc:活动榜单接口 每天凌晨 0点0分0秒触发
 */
@Slf4j
@RestController
@RequestMapping("/auction/job/activity")
public class ActivityAwardJob {

    @Autowired
    private ActivityService activityService;

    /**
     * 活动榜单派奖
     */
    @RequestMapping("/sendAward")
    public void execute(){
        //默认生成昨天的榜单
        Date date = DateUtils.addDays(new Date(), -1);
        activityService.sendAward(date);
    }

}
