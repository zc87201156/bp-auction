package com.bp.auction.server.controller.request;

import lombok.Data;

import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;

/**
 * @author zwf
 */
@Data
public class SealedAuctionRankingListRequest extends AuctionRequest {

	@NotNull
	@Min(value = 1, message = "页数最小为1")
	@Max(value = 1000, message = "页数最大不能超过1000页")
	private Integer page;

}
