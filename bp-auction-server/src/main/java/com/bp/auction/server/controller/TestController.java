package com.bp.auction.server.controller;

import com.bp.auction.server.redis.RedisLuaScriptService;
import com.bp.auction.server.service.AuctionService;
import com.bp.core.web.base.BaseController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * @author zwf
 */
@RestController
@RequestMapping("/auction/api/test")
public class TestController extends BaseController {

	@Autowired
	private RedisLuaScriptService redisLuaScriptService;
//
    @Autowired
    private AuctionService auctionService;
//
//	@RequestMapping("/test/{userId}")
//	public Object test(@PathVariable Long userId) {
//		long auctionId = 185314L;
//		long countDownTime = 10000L;
//		String nickname = "tomcat" + userId;
//		String headImg = null;
//		Integer viplevel = 5;
//		String delayMsgId = APIUtils.getUUID();
//		long historyId = 1L;
//
//		List result = redisLuaScriptService.auction(auctionId, userId, countDownTime, nickname, headImg, viplevel, delayMsgId,
//				historyId, OperateType.MANUAL);
//		return result;
//	}
//
//	@RequestMapping("/test")
//	public Object test() {
//		return auctionService.getAuctionInfoById(185309L);
//	}


//    @RequestMapping("/test1")
//	public Object test1() {
//		return redisLuaScriptService.endAuction(185309L,1,1);
//	}
}
