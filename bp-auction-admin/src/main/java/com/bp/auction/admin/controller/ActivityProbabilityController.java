package com.bp.auction.admin.controller;


import com.bp.auction.admin.service.ActivityProbabilityService;
import com.bp.auction.common.dal.entity.ActivityProbability;
import com.bp.core.base.BasePage;
import com.bp.core.response.ResponsePageData;
import com.bp.core.web.base.ExtJsController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author zc
 * @create 2019-01-24 10:34
 * @desc
 **/
@RestController
@RequestMapping("/auction/admin/activityProbability")
public class ActivityProbabilityController extends ExtJsController {
    @Autowired
    private ActivityProbabilityService activityProbabilityService;

    @RequestMapping("/list")
    public ResponsePageData<ActivityProbability> list() {
        BasePage<ActivityProbability> page = getPage(ActivityProbability.class);
        return responseSuccess(activityProbabilityService.findPage(page));
    }

    @RequestMapping("/save")
    public Object save() {
        ActivityProbability form = getForm(ActivityProbability.class);
        if (form.getId() == null) {
            activityProbabilityService.save(form);
            return responseSuccess();
        }
        ActivityProbability probability = activityProbabilityService.getById(form.getId());
        if (probability == null) {
            return responseError("配置不存在");
        }
        probability.setNum(form.getNum());
        probability.setProbability(form.getProbability());
        activityProbabilityService.save(probability);
        return responseSuccess();
    }


}
