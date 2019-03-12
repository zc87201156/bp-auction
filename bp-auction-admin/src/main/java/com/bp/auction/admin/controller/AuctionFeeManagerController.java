package com.bp.auction.admin.controller;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.bp.auction.admin.service.AuctionFeeService;
import com.bp.auction.common.constants.Status;
import com.bp.auction.common.dal.entity.AuctionFee;
import com.bp.core.base.BasePage;
import com.bp.core.response.ResponsePageData;
import com.bp.core.web.base.ExtJsController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * 手续费管理
 * @author zwf
 */
@RestController
@RequestMapping("/auction/admin/fee")
public class AuctionFeeManagerController extends ExtJsController {

	@Autowired
	private AuctionFeeService auctionFeeService;

	/**
	 * 手续费下拉框列表
	 * @return
	 */
	@RequestMapping("/getAll")
	public Object getAll() {
		JSONArray array = new JSONArray();
		List<AuctionFee> allFees = auctionFeeService.getAll();
		for (AuctionFee fee : allFees) {
			JSONObject json = newJsonObj(fee.getId(), fee.getFee(), fee.getPrice());
			array.add(json);
		}
		return responseSuccess(array);
	}

	/**
	 * 查询手续费列表
	 * @return
	 */
	@RequestMapping("/list")
	public ResponsePageData<AuctionFee> list() {
		BasePage<AuctionFee> page = getPage(AuctionFee.class);
		return responseSuccess(auctionFeeService.findPage(page));
	}

	/**
	 * 保存手续费
	 * @return
	 */
	@RequestMapping("/save")
	public Object save() {
		AuctionFee form = getForm(AuctionFee.class);
		if (form == null) {
			return responseError("请求参数错误");
		}
		if (form.getId() == null) {
			AuctionFee fee = new AuctionFee();
			fee.setFee(form.getFee());
			fee.setPrice(form.getPrice());
			//新增手续费默认禁用
			fee.setEnable(Status.DISABLE.getValue());
			auctionFeeService.save(fee);
			return responseSuccess();
		}
		AuctionFee fee = auctionFeeService.load(form.getId());
		if (fee == null) {
			return responseError("手续费id不存在");
		}
		if (fee.getEnable() != null && fee.getEnable() != Status.DISABLE.getValue()) {
			return responseError("手续费已启用,不可编辑");
		}
		fee.setFee(form.getFee());
		fee.setPrice(form.getPrice());
		auctionFeeService.save(fee);
		return responseSuccess();
	}

	/**
	 * 启用手续费
	 * @return
	 */
	@RequestMapping("/enable")
	public Object enable() {
		AuctionFee form = getForm(AuctionFee.class);
		AuctionFee fee = auctionFeeService.load(form.getId());
		if (fee == null) {
			return responseError("手续费ID不存在");
		}
		Status status = Status.getByValue(fee.getEnable());
		if (status == null) {
			return responseError("无效的状态");
		}
		if (status == Status.ENABLE) {
			return responseError("该手续费已启用");
		}
		fee.setEnable(Status.ENABLE.getValue());
		auctionFeeService.save(fee);
		return responseSuccess();
	}

	/**
	 * 禁用手续费
	 * @return
	 */
	@RequestMapping("/disable")
	public Object disable() {
		AuctionFee form = getForm(AuctionFee.class);
		AuctionFee fee = auctionFeeService.load(form.getId());
		if (fee == null) {
			return responseError("手续费ID不存在");
		}
		Status status = Status.getByValue(fee.getEnable());
		if (status == null) {
			return responseError("无效的状态");
		}
		if (status == Status.DISABLE) {
			return responseError("该手续费已禁用");
		}
		fee.setEnable(Status.DISABLE.getValue());
		auctionFeeService.save(fee);
		return responseSuccess();
	}

	/**
	 * 删除手续费
	 * @return
	 */
	@RequestMapping("/delete")
	public Object delete() {
		AuctionFee form = getForm(AuctionFee.class);
		AuctionFee fee = auctionFeeService.load(form.getId());
		if (fee == null) {
			return responseError("手续费ID不存在");
		}
		Status status = Status.getByValue(fee.getEnable());
		if (status == null) {
			return responseError("无效的状态");
		}
		if (status != Status.DISABLE) {
			return responseError("不能删除已启用的手续费");
		}
		auctionFeeService.delete(fee);
		return responseSuccess();
	}

	private static JSONObject newJsonObj(Object id, Object fee, Object price) {
		JSONObject jsonObj = new JSONObject();
		jsonObj.put("id", id);
		jsonObj.put("fee", fee);
		jsonObj.put("price", price);
		jsonObj.put("name", "收取 " + fee + " 加价 " + price + " 元");

		return jsonObj;
	}
}
