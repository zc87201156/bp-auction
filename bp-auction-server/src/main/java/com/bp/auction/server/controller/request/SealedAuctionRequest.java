package com.bp.auction.server.controller.request;

import lombok.Data;

import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;

/**
 * @author zwf
 */
@Data
public class SealedAuctionRequest extends AuctionRequest {

	@NotNull(message = "出价不可为空")
	@Min(value = 1, message = "出价必须大于0")
	@Max(value = 100000, message = "出价不能太离谱")
	private Long price;

}
