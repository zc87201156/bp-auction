package com.bp.auction.admin.controller;


import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.bp.auction.admin.service.ConfigService;
import com.bp.auction.common.constants.ChannelConstants;
import com.bp.auction.common.dal.entity.Config;
import com.bp.core.base.BasePage;
import com.bp.core.web.base.ExtJsController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Date;

/**
 * 配置项管理
 * @author zwf
 */
@RestController
@RequestMapping("/auction/admin/config")
public class ConfigController extends ExtJsController {

	@Autowired
	private ConfigService configService;

	/**
	 * 配置项列表
	 * @return
	 */
	@RequestMapping("/list")
	public Object list() {
		BasePage<Config> page = getPage(Config.class);
		return responseSuccess(configService.findPage(page));
	}

	/**
	 * 保存配置项
	 * @return
	 */
	@RequestMapping("/save")
	public Object save() {
		Config form = getForm(Config.class);
		if (form == null) {
			return responseError("请求参数错误");
		}
		Config config = configService.findByName(form.getName());
		if (form.getId() == null && config != null) {
			return responseError("配置项已经存在");
		}

		if (form.getId() != null && config != null && !form.getId().equals(config.getId())) {
			return responseError("配置项已经存在");
		}
		if (config == null) {
			form.setChannelId(ChannelConstants.DEFAULT_CHANNEL);//默认给个渠道ID
		}
		form.setUpdateTime(new Date());

		configService.save(form);

		return responseSuccess();
	}

	@RequestMapping("/delete")
	public Object delete() {
		Config entity = getForm(Config.class);
		configService.delete(entity);
		return responseSuccess();
	}
}
