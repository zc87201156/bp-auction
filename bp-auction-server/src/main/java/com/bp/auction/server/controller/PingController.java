package com.bp.auction.server.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 客户端调用此接口来判断服务器是否正在运行,以此来决定是否显示服务器维护页面
 * @author zwf
 */
@RestController
@RequestMapping("/auction/api/ping")
public class PingController {

	@RequestMapping
	public Object ping() {
		return null;
	}
}
