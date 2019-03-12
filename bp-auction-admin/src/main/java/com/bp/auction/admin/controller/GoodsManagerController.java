package com.bp.auction.admin.controller;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;

import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.bp.auction.admin.service.GoodsService;
import com.bp.auction.common.constants.Status;
import com.bp.auction.common.dal.entity.Goods;
import com.bp.core.base.BasePage;
import com.bp.core.response.ResponsePageData;
import com.bp.core.web.base.ExtJsController;
import org.apache.commons.lang.StringUtils;
import org.jasig.cas.client.util.AssertionHolder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * 商品管理
 *
 * @author zwf
 */
@RestController
@RequestMapping("/auction/admin/goods")
public class GoodsManagerController extends ExtJsController {

    @Autowired
    private GoodsService goodsService;

    /**
     * 获取所有的商品列表
     *
     * @return
     */
    @RequestMapping("/getAll")
    public Object getAll() {
        JSONArray array = new JSONArray();
        List<Goods> allGoods = goodsService.getAll();
        for (Goods goods : allGoods) {
            JSONObject json = newJsonObj(goods.getId(), goods.getName());
            array.add(json);
        }
        return responseSuccess(array);
    }

    /**
     * 查询商品列表
     *
     * @return
     */
    @RequestMapping("/list")
    public ResponsePageData<Goods> list() {
        BasePage<Goods> page = getPage(Goods.class);
        return responseSuccess(goodsService.findPage(page));
    }

    /**
     * 保存商品信息
     *
     * @return
     */
    @RequestMapping("/save")
    public Object save() {
        Goods form = getForm(Goods.class);
        if (form == null) {
            return responseError("请求参数错误");
        }
        //新增
        if (form.getId() == null) {
            Goods goods = new Goods();
            if (StringUtils.isNotBlank(form.getNo())) {
                goods.setNo(form.getNo().trim());
            }
            if (StringUtils.isNotBlank(form.getName())) {
                goods.setName(form.getName().trim());
            }
            if (StringUtils.isNotBlank(form.getDefaultImage())) {
                goods.setDefaultImage(form.getDefaultImage().trim());
            }
            if (StringUtils.isNotBlank(form.getImages())) {
                goods.setImages(form.getImages().trim());
            }
            goods.setMarketPrice(form.getMarketPrice());
            goods.setStartPrice(form.getStartPrice());
            goods.setAuctionFeeId(form.getAuctionFeeId());
            goods.setPlatProductId(form.getPlatProductId());
            //新增商品默认禁用
            goods.setEnable(Status.DISABLE.getValue());
            goods.setOperator(AssertionHolder.getAssertion().getPrincipal().getName());
            goodsService.save(goods);
            return responseSuccess();
        }
        Goods goods = goodsService.get(form.getId());
        if (goods == null) {
            return responseError("商品ID不存在");
        }
        if (goods.getEnable() != null && goods.getEnable() != Status.DISABLE.getValue()) {
            return responseError("商品已上架，不可编辑");
        }
        //编辑
        if (StringUtils.isNotBlank(form.getNo())) {
            goods.setNo(form.getNo().trim());
        }
        if (StringUtils.isNotBlank(form.getName())) {
            goods.setName(form.getName().trim());
        }
        if (StringUtils.isBlank(form.getDefaultImage())) {
            goods.setDefaultImage(null);
        } else {
            goods.setDefaultImage(form.getDefaultImage().trim());
        }
        if (StringUtils.isBlank(form.getImages())) {
            goods.setImages(null);
        } else {
            goods.setImages(form.getImages().trim());
        }
        goods.setMarketPrice(form.getMarketPrice());
        goods.setStartPrice(form.getStartPrice());
        goods.setAuctionFeeId(form.getAuctionFeeId());
        goods.setPlatProductId(form.getPlatProductId());
        goods.setOperator(AssertionHolder.getAssertion().getPrincipal().getName());
        goodsService.save(goods);
        return responseSuccess();
    }

    /**
     * 删除商品
     *
     * @return
     */
    @RequestMapping("/delete")
    public Object delete() {
        Goods form = getForm(Goods.class);
        Goods goods = goodsService.get(form.getId());
        if (goods == null) {
            return responseError("商品ID不存在");
        }
        Status status = Status.getByValue(goods.getEnable());
        if (status == null) {
            return responseError("无效的状态");
        }
        if (status != Status.DISABLE) {
            return responseError("不能删除已上架的商品");
        }
        goodsService.delete(goods);
        return responseSuccess();
    }

    /**
     * 商品上架
     *
     * @return
     */
    @RequestMapping("/enable")
    public Object enable() {
        Goods form = getForm(Goods.class);
        Goods goods = goodsService.get(form.getId());
        if (goods == null) {
            return responseError("商品ID不存在");
        }
        Status status = Status.getByValue(goods.getEnable());
        if (status == null) {
            return responseError("无效的状态");
        }
        if (status == Status.ENABLE) {
            return responseError("该商品已上架");
        }
        goods.setEnable(Status.ENABLE.getValue());
        goodsService.save(goods);
        return responseSuccess();
    }

    /**
     * 商品下架
     *
     * @return
     */
    @RequestMapping("/disable")
    public Object disable() {
        Goods form = getForm(Goods.class);
        Goods goods = goodsService.get(form.getId());
        if (goods == null) {
            return responseError("商品ID不存在");
        }
        Status status = Status.getByValue(goods.getEnable());
        if (status == null) {
            return responseError("无效的状态");
        }
        if (status == Status.DISABLE) {
            return responseError("该商品已下架");
        }
        goods.setEnable(Status.DISABLE.getValue());
        goodsService.save(goods);
        return responseSuccess();
    }

    private static JSONObject newJsonObj(Object id, Object name) {
        JSONObject jsonObj = new JSONObject();
        jsonObj.put("id", id);
        jsonObj.put("name", name);

        return jsonObj;
    }
}
