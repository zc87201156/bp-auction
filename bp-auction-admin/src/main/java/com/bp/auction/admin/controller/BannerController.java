package com.bp.auction.admin.controller;


import com.bp.auction.admin.service.BannerService;
import com.bp.auction.common.constants.Status;
import com.bp.auction.common.dal.entity.Banner;
import com.bp.core.base.BasePage;
import com.bp.core.response.ResponsePageData;
import com.bp.core.web.base.ExtJsController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author zc
 * @create 2018-12-06 11:28
 * @desc
 **/
@RestController
@RequestMapping("/auction/admin/banner")
public class BannerController extends ExtJsController {
    @Autowired
    private BannerService bannerService;

    /**
     * banner图列表
     *
     * @return
     */
    @RequestMapping("/list")
    public ResponsePageData<Banner> list() {
        BasePage<Banner> page = getPage(Banner.class);
        return responseSuccess(bannerService.findPage(page));
    }


    /**
     * 保存配置项
     *
     * @return
     */
    @RequestMapping("/save")
    public Object save() {
        Banner form = getForm(Banner.class);
        if (form == null) {
            return responseError("请求参数错误");
        }
        //默认状态是禁用
        form.setEnable(Status.DISABLE.getValue());
        bannerService.save(form);
        return responseSuccess();
    }

    /**
     * 启用banner图
     *
     * @return
     */
    @RequestMapping("/enable")
    public Object enable() {
        Banner form = getForm(Banner.class);
        Banner banner = bannerService.getById(form.getId());
        if (banner == null) {
            return responseError("Banner图不存在");
        }
        Status status = Status.getByValue(banner.getEnable());
        if (status == null) {
            return responseError("无效的状态");
        }
        if (status == Status.ENABLE) {
            return responseError("该Banner图已启用");
        }
        banner.setEnable(Status.ENABLE.getValue());
        bannerService.save(banner);
        return responseSuccess();
    }

    /**
     * 禁用banner图
     *
     * @return
     */
    @RequestMapping("/disable")
    public Object disable() {
        Banner form = getForm(Banner.class);
        Banner banner = bannerService.getById(form.getId());
        if (banner == null) {
            return responseError("Banner图不存在");
        }
        Status status = Status.getByValue(banner.getEnable());
        if (status == null) {
            return responseError("无效的状态");
        }
        if (status == Status.DISABLE) {
            return responseError("该Banner图已禁用");
        }
        banner.setEnable(Status.DISABLE.getValue());
        bannerService.save(banner);
        return responseSuccess();
    }

    /**
     * 删除Banner图
     *
     * @return
     */
    @RequestMapping("/delete")
    public Object delete() {
        Banner form = getForm(Banner.class);
        Banner banner = bannerService.getById(form.getId());
        if (banner == null) {
            return responseError("Banner ID不存在");
        }
        Status status = Status.getByValue(banner.getEnable());
        if (status == null) {
            return responseError("无效的状态");
        }
        if (status != Status.DISABLE) {
            return responseError("不能删除已启用的Banner图");
        }
        bannerService.delete(banner);
        return responseSuccess();
    }

}
