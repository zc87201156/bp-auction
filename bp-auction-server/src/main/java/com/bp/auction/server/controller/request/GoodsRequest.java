package com.bp.auction.server.controller.request;

import lombok.Data;

import javax.validation.constraints.NotNull;

/**
 * @author zwf
 */
@Data
public class GoodsRequest {

	@NotNull(message = "商品id不能为空")
	private Long goodsId;
}
