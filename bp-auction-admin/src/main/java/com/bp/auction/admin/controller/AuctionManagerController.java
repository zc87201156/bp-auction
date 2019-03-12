package com.bp.auction.admin.controller;


import com.bp.auction.admin.service.AuctionService;
import com.bp.auction.admin.service.GoodsService;
import com.bp.auction.common.constants.*;
import com.bp.auction.common.dal.entity.Auction;
import com.bp.auction.common.dal.entity.Goods;
import com.bp.core.base.BasePage;
import com.bp.core.response.ResponsePageData;
import com.bp.core.web.base.ExtJsController;
import org.jasig.cas.client.util.AssertionHolder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Date;

/**
 * 拍卖管理
 *
 * @author zwf
 */
@RestController
@RequestMapping("/auction/admin/auction")
public class AuctionManagerController extends ExtJsController {

    @Autowired
    private AuctionService auctionService;

    @Autowired
    private GoodsService goodsService;


    /**
     * 查询拍卖列表
     *
     * @return
     */
    @RequestMapping("/list")
    public ResponsePageData<Auction> list() {
        BasePage<Auction> page = getPage(Auction.class);
        return responseSuccess(auctionService.findPage(page));
    }

    /**
     * 保存拍卖
     *
     * @return
     */
    @RequestMapping("/save")
    public Object save() {
        Auction form = getForm(Auction.class);
        if (form == null) {
            return responseError("请求参数错误");
        }
        Integer auctionClass = form.getAuctionClass();
        if (auctionClass == AuctionClass.FREE_AUCTION_FEE.getValue() &&
                (form.getFreeEntryFee() == null || form.getFreeRaisePrice() == null)) {
            return responseError("免手续费场报名费和加价幅度不可为空");
        }

        if (auctionClass == AuctionClass.SEALED.getValue()) {
            Date endTime = form.getEndTime();
            if (endTime == null) {
                return responseError("暗拍场拍卖结束时间不可为空");
            }
            if (endTime.getTime() < System.currentTimeMillis()) {
                return responseError("拍卖结束时间不可早于当前时间");
            }
            if (endTime.getTime() <= form.getStartTime().getTime()) {
                return responseError("拍卖结束时间不可早于拍卖开始时间");
            }
        }

        //新增
        if (form.getId() == null) {
            Goods goods = goodsService.get(form.getGoodsId());
            if (goods == null) {
                return responseError("商品ID不存在");
            }
            Auction auction = new Auction();
            auction.setGoodsId(goods.getId());
            auction.setStartTime(form.getStartTime());
            //只有暗拍场才保存拍卖结束时间
            if (auctionClass == AuctionClass.SEALED.getValue()) {
                auction.setEndTime(form.getEndTime());
            }
            auction.setCurrentPrice(goods.getStartPrice());
            auction.setAuctionStatus(AuctionStatus.NO_AUCTION.getValue());
            auction.setPaymentStatus(PaymentStatus.UNPAID.getValue());
            auction.setSort(form.getSort());
            auction.setNextId(form.getNextId());
            //新增时默认禁用,启用时会再向拍卖服务器发送新增拍卖事件
            auction.setEnable(Status.DISABLE.getValue());
            auction.setOperator(AssertionHolder.getAssertion().getPrincipal().getName());
            auction.setEnvironment(form.getEnvironment());
            //类型为手动配置拍卖
            auction.setType(AuctionType.MANUAL.getValue());
            auction.setAuctionClass(form.getAuctionClass());
            auction.setCanDeposit(form.getCanDeposit());
            auction.setFreeEntryFee(form.getFreeEntryFee());
            auction.setFreeRaisePrice(form.getFreeRaisePrice());
            auctionService.save(auction);
            return responseSuccess();
        }
        //编辑
        Auction auction = auctionService.getById(form.getId());
        if (auction == null) {
            return responseError("拍卖信息不存在");
        }
        Status status = Status.getByValue(auction.getEnable());
        if (status == null) {
            return responseError("无效的状态");
        }
        if (status != Status.DISABLE) {
            return responseError("该拍卖已启用，无法编辑");
        }
        //滚拍生成的场次不允许从这边手动编辑
        if (auction.getType() == AuctionType.ROLL.getValue()) {
            return responseError("滚拍场次无法手动编辑");
        }
        auction.setGoodsId(form.getGoodsId());
        auction.setStartTime(form.getStartTime());
        //只有暗拍场才保存拍卖结束时间
        if (auctionClass == AuctionClass.SEALED.getValue()) {
            auction.setEndTime(form.getEndTime());
        }
        auction.setSort(form.getSort());
        auction.setNextId(form.getNextId());
        auction.setOperator(AssertionHolder.getAssertion().getPrincipal().getName());
        auction.setEnvironment(form.getEnvironment());
        auction.setAuctionClass(form.getAuctionClass());
        auction.setCanDeposit(form.getCanDeposit());
        auction.setFreeEntryFee(form.getFreeEntryFee());
        auction.setFreeRaisePrice(form.getFreeRaisePrice());
        auctionService.save(auction);
        return responseSuccess();
    }

    /**
     * 删除拍卖
     *
     * @return
     */
    @RequestMapping("/delete")
    public Object delete() {
        Auction form = getForm(Auction.class);
        Auction auction = auctionService.getById(form.getId());
        if (auction == null) {
            return responseError("拍卖信息不存在");
        }
        Status status = Status.getByValue(auction.getEnable());
        if (status == null) {
            return responseError("无效的状态");
        }
        if (status != Status.DISABLE) {
            return responseError("不能删除已启用的拍卖");
        }
        auctionService.delete(auction);
        return responseSuccess();
    }

    /**
     * 开启拍卖
     *
     * @return
     */
    @RequestMapping("/enable")
    public Object enable() {
        Auction form = getForm(Auction.class);
        Auction auction = auctionService.getById(form.getId());
        if (auction == null) {
            return responseError("拍卖信息不存在");
        }
        Status status = Status.getByValue(auction.getEnable());
        if (status == null) {
            return responseError("无效的状态");
        }
        if (status == Status.ENABLE) {
            return responseError("该拍卖已开启");
        }

        //滚拍生成的场次不允许从这边手动编辑
        if (auction.getType() == AuctionType.ROLL.getValue()) {
            return responseError("滚拍场次不允许手动编辑");
        }
        Environment env = Environment.getByValue(auction.getEnvironment());
        if (env == null) {
            return responseError("未知环境的拍卖");
        }

        //启用拍卖消息
        boolean success = auctionService.enableAuction(auction);
        if (!success) {
            return responseError("该拍卖的开始时间早于当前时间，无法启动拍卖。");
        }
        return responseSuccess();
    }

    /**
     * 取消拍卖
     *
     * @return
     */
    @RequestMapping("/disable")
    public Object disable() {
        Auction form = getForm(Auction.class);
        Auction auction = auctionService.getById(form.getId());
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
        AuctionStatus auctionStatus = AuctionStatus.getByValue(auction.getAuctionStatus());
        if (auctionStatus == null) {
            return responseError("无效的拍卖状态");
        }
        if (auctionStatus != AuctionStatus.NO_AUCTION) {
            return responseError("取消拍卖失败。该拍卖已经开始或已结束");
        }
        //滚拍生成的场次不允许从这边手动编辑
        if (auction.getType() == AuctionType.ROLL.getValue()) {
            return responseError("滚拍场次不允许手动编辑");
        }
        Environment env = Environment.getByValue(auction.getEnvironment());
        if (env == null) {
            return responseError("未知环境的拍卖");
        }
        //设置已禁用状态
        auction.setEnable(Status.DISABLE.getValue());
        auctionService.save(auction);
        //取消拍卖
        auctionService.disableAuction(auction.getId());
        return responseSuccess();
    }
}
