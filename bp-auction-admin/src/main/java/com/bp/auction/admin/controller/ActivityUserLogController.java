package com.bp.auction.admin.controller;


import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.bp.auction.admin.service.ActivityUserLogService;
import com.bp.auction.common.dal.entity.ActivityUserLog;
import com.bp.core.base.BasePage;
import com.bp.core.response.ResponsePageData;
import com.bp.core.web.base.ExtJsController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 活动用户日志
 *
 * @author zc
 * @create 2019-01-24 10:34
 * @desc
 **/
@RestController
@RequestMapping("/auction/admin/activityUserLog")
public class ActivityUserLogController extends ExtJsController {
    @Autowired
    private ActivityUserLogService activityUserLogService;

    @RequestMapping("/list")
    public ResponsePageData<ActivityUserLog> list() {
        BasePage<ActivityUserLog> page = getPage(ActivityUserLog.class);
        return responseSuccess(activityUserLogService.findPage(page));
    }
    
}
