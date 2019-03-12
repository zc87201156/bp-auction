package com.bp.auction.server.controller.request;

import lombok.Data;

import javax.validation.constraints.NotNull;

/**
 * 订阅、取消订阅拍卖信息变化请求
 * @author zwf
 */
@Data
public class AuctionInfoChangeRequest extends AuctionRequest {

	@NotNull
	private Boolean push;
}
