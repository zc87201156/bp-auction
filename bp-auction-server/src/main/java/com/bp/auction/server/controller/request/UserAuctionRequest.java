package com.bp.auction.server.controller.request;

import lombok.Data;

import javax.validation.constraints.NotNull;

/**
 * 用户出价请求
 * @author zwf
 */
@Data
public class UserAuctionRequest extends AuctionRequest {

	@NotNull(message = "渠道id不可为空")
	private Long channelId;
}
