package com.bp.auction.admin.controller;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.bp.auction.admin.service.CategoryConfigService;
import com.bp.auction.common.constants.Status;
import com.bp.auction.common.dal.entity.CategoryConfig;
import com.bp.core.base.BasePage;
import com.bp.core.response.ResponsePageData;
import com.bp.core.web.base.ExtJsController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.CollectionUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * @author zc
 * @create 2018-12-06 11:28
 * @desc
 **/
@RestController
@RequestMapping("/auction/admin/categoryConfig")
public class CategoryConfigController extends ExtJsController {
    @Autowired
    private CategoryConfigService categoryConfigService;

    /**
     * 获取所有的商品列表
     *
     * @return
     */
    @RequestMapping("/getAll")
    public Object getAll() {
        JSONArray array = new JSONArray();
        List<CategoryConfig> list = categoryConfigService.listCategory();
        if (!CollectionUtils.isEmpty(list)) {
            for (CategoryConfig categoryConfig : list) {
                JSONObject json = newJsonObj(categoryConfig.getId(), categoryConfig.getName());
                array.add(json);
            }
        }
        return responseSuccess(array);
    }

    /**
     * 类目列表
     *
     * @return
     */
    @RequestMapping("/list")
    public ResponsePageData<CategoryConfig> list() {
        BasePage<CategoryConfig> page = getPage(CategoryConfig.class);
        return responseSuccess(categoryConfigService.findPage(page));
    }


    /**
     * 保存配置项
     *
     * @return
     */
    @RequestMapping("/save")
    public Object save() {
        CategoryConfig form = getForm(CategoryConfig.class);
        if (form == null) {
            return responseError("请求参数错误");
        }
        //默认状态是禁用
        form.setEnable(Status.DISABLE.getValue());
        categoryConfigService.save(form);
        return responseSuccess();
    }

    /**
     * 启用类目
     *
     * @return
     */
    @RequestMapping("/enable")
    public Object enable() {
        CategoryConfig form = getForm(CategoryConfig.class);
        CategoryConfig categoryConfig = categoryConfigService.getById(form.getId());
        if (categoryConfig == null) {
            return responseError("类目信息不存在");
        }
        Status status = Status.getByValue(categoryConfig.getEnable());
        if (status == null) {
            return responseError("无效的状态");
        }
        if (status == Status.ENABLE) {
            return responseError("该类目信息已启用");
        }
        categoryConfig.setEnable(Status.ENABLE.getValue());
        categoryConfigService.save(categoryConfig);
        return responseSuccess();
    }

    /**
     * 禁用类目
     *
     * @return
     */
    @RequestMapping("/disable")
    public Object disable() {
        CategoryConfig form = getForm(CategoryConfig.class);
        CategoryConfig categoryConfig = categoryConfigService.getById(form.getId());
        if (categoryConfig == null) {
            return responseError("类目信息不存在");
        }
        Status status = Status.getByValue(categoryConfig.getEnable());
        if (status == null) {
            return responseError("无效的状态");
        }
        if (status == Status.DISABLE) {
            return responseError("该类目信息已禁用");
        }
        categoryConfig.setEnable(Status.DISABLE.getValue());
        categoryConfigService.save(categoryConfig);
        return responseSuccess();
    }

    /**
     * 删除类目
     *
     * @return
     */
    @RequestMapping("/delete")
    public Object delete() {
        CategoryConfig form = getForm(CategoryConfig.class);
        CategoryConfig categoryConfig = categoryConfigService.getById(form.getId());
        if (categoryConfig == null) {
            return responseError("类目信息不存在");
        }
        Status status = Status.getByValue(categoryConfig.getEnable());
        if (status == null) {
            return responseError("无效的状态");
        }
        if (status != Status.DISABLE) {
            return responseError("不能删除已启用的类目信息");
        }
        categoryConfigService.delete(categoryConfig);
        return responseSuccess();
    }


    private static JSONObject newJsonObj(Object id, Object name) {
        JSONObject jsonObj = new JSONObject();
        jsonObj.put("id", id);
        jsonObj.put("name", name);

        return jsonObj;
    }

}
