package com.bp.auction.server.controller.request;

import lombok.Data;

import javax.validation.constraints.NotBlank;

/**
 * @author zwf
 */
@Data
public class PaymentNotifyRequest {

	@NotBlank(message = "bizId不可为空")
	private String bizId;

	@NotBlank(message = "orderNo不可为空")
	private String orderNo;

	@NotBlank(message = "paymentTime不可为空")
	private String paymentTime;
}
