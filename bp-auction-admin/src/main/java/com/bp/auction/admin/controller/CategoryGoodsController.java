package com.bp.auction.admin.controller;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.bp.auction.admin.service.CategoryGoodsService;
import com.bp.auction.admin.service.RollAuctionService;
import com.bp.auction.common.dal.entity.CategoryGoods;
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
@RequestMapping("/auction/admin/categoryGoods")
public class CategoryGoodsController extends ExtJsController {
    @Autowired
    private CategoryGoodsService categoryGoodsService;
    @Autowired
    private RollAuctionService rollAuctionService;

    /**
     * 类目商品列表
     *
     * @return
     */
    @RequestMapping("/list")
    public ResponsePageData<CategoryGoods> list() {
        BasePage<CategoryGoods> page = getPage(CategoryGoods.class);
        return responseSuccess(categoryGoodsService.findPage(page));
    }


    /**
     * 保存
     *
     * @return
     */
    @RequestMapping("/save")
    public Object save() {
        CategoryGoods form = getForm(CategoryGoods.class);
        if (form == null) {
            return responseError("请求参数错误");
        }
        long num = rollAuctionService.countByCategoryId(form.getCategoryId());
        if (num > 0) {
            return responseError("该类目下的商品当前已被关联有效滚拍，无法进行此操作!");
        }
        categoryGoodsService.save(form);
        return responseSuccess();
    }


    /**
     * 删除类目商品关联
     *
     * @return
     */
    @RequestMapping("/delete")
    public Object delete() {
        CategoryGoods form = getForm(CategoryGoods.class);
        CategoryGoods categoryGoods = categoryGoodsService.getById(form.getId());
        if (categoryGoods == null) {
            return responseError("记录不存在");
        }
        long num = rollAuctionService.countByCategoryId(form.getCategoryId());
        if (num > 0) {
            return responseError("该类目下的商品当前已被关联有效的滚拍，无法进行此操作!");
        }
        categoryGoodsService.deleteRecord(categoryGoods);
        return responseSuccess();
    }
}
