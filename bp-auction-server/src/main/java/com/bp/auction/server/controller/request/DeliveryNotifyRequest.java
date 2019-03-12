package com.bp.auction.server.controller.request;

import lombok.Data;

import javax.validation.constraints.NotNull;

/**
 * @author zwf
 */
@Data
public class DeliveryNotifyRequest {

	@NotNull(message = "businessId不可为空")
	private Long businessId;

	private Long activityId;

	private String receiveRemark;

	@NotNull(message = "receiveStatus不可为空")
	private Integer receiveStatus;
}
