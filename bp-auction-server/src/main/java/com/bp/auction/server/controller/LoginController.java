package com.bp.auction.server.controller;

import com.bp.auction.common.constants.ActivityOperateType;
import com.bp.auction.server.service.ActivityService;
import com.bp.auction.server.service.BeginnerService;
import com.bp.auction.server.service.UserService;
import com.bp.core.response.ResponseBean;
import com.bp.core.web.base.BaseController;
import com.bp.platform.rpc.dto.UserDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

/**
 * 登录接口,因网关已拦截验证用户身份，此处用于客户端请求之后，服务器初始化及客户端获取一些业务数据
 * @author zwf
 */
@RestController
@RequestMapping("/auction/api/login")
public class LoginController extends BaseController {

	@Autowired
	private BeginnerService beginnerService;

	@Autowired
	private UserService userService;

	@Autowired
	private ActivityService activityService;

	@RequestMapping
	public ResponseBean login() {
		Long userId = getUserId();

		//初始化用户新手信息
		beginnerService.initBeginner(userId);

		//查询用户当前所在的拍卖场次
		Long currentAuctionId = userService.getCurrentAuctionId(userId);

		//活动每日登陆处理
		activityService.dealActivity(userId, ActivityOperateType.LOGIN);

		Map<String, Object> map = new HashMap<>();
		map.put("userId", userId);
		map.put("currentAuctionId", currentAuctionId);
		//获取用户基本信息
		UserDto userDto=userService.getByUserId(userId);
		if(userDto!=null){
			map.put("nickname",userDto.getNickname());
			map.put("headImg",userDto.getHeadImg());
			Integer vipLevel=userService.getVipLevelByUserId(userId);
			map.put("vipLevel",vipLevel);
		}
		return responseSuccess(map);
	}
}
