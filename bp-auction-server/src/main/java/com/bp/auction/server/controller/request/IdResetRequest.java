package com.bp.auction.server.controller.request;

import lombok.Data;

import javax.validation.constraints.NotBlank;

/**
 * @author zwf
 */
@Data
public class IdResetRequest {

	@NotBlank
	private String password;

	@NotBlank
	private String dbName;
}
