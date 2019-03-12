package com.bp.auction.server.controller.request;

import lombok.Data;

import javax.validation.constraints.NotNull;

/**
 * @author zwf
 */
@Data
public class AuctionRequest {

    @NotNull(message = "拍卖id不可为空")
    private Long auctionId;
}
