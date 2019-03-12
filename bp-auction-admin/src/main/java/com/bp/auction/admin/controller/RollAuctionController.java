package com.bp.auction.admin.controller;

import com.bp.auction.admin.service.CategoryConfigService;
import com.bp.auction.admin.service.CategoryGoodsService;
import com.bp.auction.admin.service.RollAuctionService;
import com.bp.auction.common.constants.*;
import com.bp.auction.common.dal.entity.CategoryConfig;
import com.bp.auction.common.dal.entity.CategoryGoods;
import com.bp.auction.common.dal.entity.RollAuction;
import com.bp.auction.common.pubsub.PublishService;
import com.bp.core.base.BasePage;
import com.bp.core.web.base.ExtJsController;
import org.jasig.cas.client.util.AssertionHolder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.CollectionUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * @author zc
 * @create 2018-12-10 11:08
 * @desc 滚拍配置管理
 **/
@RestController
@RequestMapping("/auction/admin/rollAuction")
public class RollAuctionController extends ExtJsController {

    @Autowired
    private RollAuctionService rollAuctionService;

    @Autowired
    private PublishService publishService;

    @Autowired
    private CategoryConfigService categoryConfigService;

    @Autowired
    private CategoryGoodsService categoryGoodsService;

    /**
     * 滚拍配置列表
     *
     * @return
     */
    @RequestMapping("/list")
    public Object list() {
        BasePage<RollAuction> page = getPage(RollAuction.class);
        return responseSuccess(rollAuctionService.findPage(page));
    }

    /**
     * 保存滚拍配置
     *
     * @return
     */
    @RequestMapping("/save")
    public Object save() {
        RollAuction form = getForm(RollAuction.class);
        if (form == null) {
            return responseError("请求参数错误");
        }
        CategoryConfig categoryConfig = categoryConfigService.getById(form.getCategoryId());
        if (categoryConfig == null || categoryConfig.getEnable() == Status.DISABLE.getValue()) {
            return responseError("类目不存在或已被禁用");
        }
        //校验类目下是否有可用商品
        List<CategoryGoods> goods = categoryGoodsService.listGoods(categoryConfig.getId());
        if (CollectionUtils.isEmpty(goods)) {
            return responseError("类目下无可用商品");
        }
        Integer type = form.getType();
        if (type == RollAuctionType.FREE_AUCTION_FEE.getValue() &&
                (form.getFreeEntryFee() == null || form.getFreeRaisePrice() == null)) {
            return responseError("免手续费场报名费和加价幅度不可为空");
        }
        //校验类目下面是否配有
        if (form.getId() == null) {
            //默认状态是禁用
            form.setEnable(Status.DISABLE.getValue());
            form.setStatus(RollAuctionStatus.NOT_END.getValue());
            form.setCurrentTurn(0);
            //记录操作人
            form.setOperator(AssertionHolder.getAssertion().getPrincipal().getName());
            rollAuctionService.save(form);
            return responseSuccess();
        }
        //编辑
        RollAuction rollAuction = rollAuctionService.getById(form.getId());
        if (rollAuction == null) {
            return responseError("滚拍信息不存在");
        }
        Status status = Status.getByValue(rollAuction.getEnable());
        if (status == null) {
            return responseError("无效的状态");
        }
        if (status != Status.DISABLE) {
            return responseError("该滚拍已启用，无法编辑");
        }
        if (rollAuction.getStatus() == RollAuctionStatus.ENDED.getValue()) {
            return responseError("该滚拍已经结束，无法编辑");
        }
        rollAuction.setType(form.getType());
        rollAuction.setCategoryId(form.getCategoryId());
        rollAuction.setPeriod(form.getPeriod());
        rollAuction.setStartTime(form.getStartTime());
        rollAuction.setEndTime(form.getEndTime());
        rollAuction.setSort(form.getSort());
        rollAuction.setEnvironment(form.getEnvironment());
        rollAuction.setTurns(form.getTurns());
        rollAuction.setCanDeposit(form.getCanDeposit());
        rollAuction.setFreeEntryFee(form.getFreeEntryFee());
        rollAuction.setFreeRaisePrice(form.getFreeRaisePrice());
        rollAuctionService.save(rollAuction);
        return responseSuccess();
    }

    /**
     * 开启拍卖
     *
     * @return
     */
    @RequestMapping("/enable")
    public Object enable() {
        RollAuction form = getForm(RollAuction.class);
        RollAuction auction = rollAuctionService.getById(form.getId());
        if (auction == null) {
            return responseError("滚拍信息不存在");
        }
        Status status = Status.getByValue(auction.getEnable());
        if (status == null) {
            return responseError("无效的状态");
        }
        if (status == Status.ENABLE) {
            return responseError("滚拍已启用");
        }
        if (auction.getStatus() == RollAuctionStatus.ENDED.getValue()) {
            return responseError("该滚拍已经结束，无法启用");
        }
        Environment env = Environment.getByValue(auction.getEnvironment());
        if (env == null) {
            return responseError("未知环境的滚拍");
        }
        rollAuctionService.enableRollAuction(auction);
        return responseSuccess();
    }

    /**
     * 取消滚拍
     *
     * @return
     */
    @RequestMapping("/disable")
    public Object disable() {
        RollAuction form = getForm(RollAuction.class);
        RollAuction auction = rollAuctionService.getById(form.getId());
        if (auction == null) {
            return responseError("拍卖信息不存在");
        }
        Status status = Status.getByValue(auction.getEnable());
        if (status == null) {
            return responseError("无效的状态");
        }
        if (status == Status.DISABLE) {
            return responseError("该拍卖已取消");
        }
        Environment env = Environment.getByValue(auction.getEnvironment());
        if (env == null) {
            return responseError("未知环境的拍卖");
        }
        rollAuctionService.cancelRollAuction(auction);
        return responseSuccess();
    }

}
