package com.bp.auction.admin.controller;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;

import com.bp.auction.admin.service.ActivityService;
import com.bp.auction.common.constants.Status;
import com.bp.auction.common.constants.YesOrNo;
import com.bp.auction.common.dal.entity.Activity;
import com.bp.core.base.BasePage;
import com.bp.core.response.ResponseBean;
import com.bp.core.response.ResponsePageData;
import com.bp.core.web.base.ExtJsController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * @author zc
 * @create 2019-01-24 10:34
 * @desc
 **/
@RestController
@RequestMapping("/auction/admin/activity")
public class ActivityManagerController extends ExtJsController {
    @Autowired
    private ActivityService activityService;

    @RequestMapping("/list")
    public ResponsePageData<Activity> list() {
        BasePage<Activity> page = getPage(Activity.class);
        return responseSuccess(activityService.findPage(page));
    }

    @RequestMapping("/save")
    public ResponseBean save() {
        Activity form = getForm(Activity.class);
        if (form.getId() == null) {
            form.setEnable(YesOrNo.NO.getValue());//状态默认禁用
            activityService.save(form);
            return responseSuccess();
        }
        Activity activity = activityService.getById(form.getId());
        if (activity == null) {
            return responseError("活动不存在");
        }
        if (activity.getEnable() == YesOrNo.YES.getValue()) {
            return responseError("启用状态的活动不能编辑");
        }
        activity.setName(form.getName());
        activity.setAwardNum(form.getAwardNum());
        activity.setStartTime(form.getStartTime());
        activity.setEndTime(form.getEndTime());
        activity.setRankNum(form.getRankNum());
        activityService.save(activity);
        return responseSuccess();
    }

    /***
     * 启用活动
     * @return
     */
    @RequestMapping("/enable")
    public Object enable() {
        Activity form = getForm(Activity.class);
        Activity activity = activityService.getById(form.getId());
        if (activity == null) {
            return responseError("活动不存在");
        }
        Status status = Status.getByValue(activity.getEnable());
        if (status == null) {
            return responseError("无效的状态");
        }
        if (status == Status.ENABLE) {
            return responseError("该活动已启用");
        }
        activity.setEnable(Status.ENABLE.getValue());
        activityService.save(activity);
        return responseSuccess();
    }

    /**
     * 禁用活动
     *
     * @return
     */
    @RequestMapping("/disable")
    public Object disable() {
        Activity form = getForm(Activity.class);
        Activity activity = activityService.getById(form.getId());
        if (activity == null) {
            return responseError("活动不存在");
        }
        Status status = Status.getByValue(activity.getEnable());
        if (status == null) {
            return responseError("无效的状态");
        }
        if (status == Status.DISABLE) {
            return responseError("该活动已禁用");
        }
        activity.setEnable(Status.DISABLE.getValue());
        activityService.save(activity);
        return responseSuccess();
    }

    @RequestMapping("/getAll")
    public ResponseBean getAll() {
        JSONArray array = new JSONArray();
        List<Activity> list = activityService.list();
        for (Activity activity : list) {
            JSONObject json = newJsonObj(activity.getId(), activity.getName());
            array.add(json);
        }
        return responseSuccess(array);
    }

    private static JSONObject newJsonObj(Object id, Object name) {
        JSONObject jsonObj = new JSONObject();
        jsonObj.put("id", id);
        jsonObj.put("name", name);
        return jsonObj;
    }

}
