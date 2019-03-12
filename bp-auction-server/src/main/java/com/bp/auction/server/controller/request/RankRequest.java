package com.bp.auction.server.controller.request;

import lombok.Data;

import javax.validation.constraints.NotNull;

/**
 * @author zwf
 */
@Data
public class RankRequest {

	@NotNull(message = "日期时间戳不能为空")
	private Long date;

}
