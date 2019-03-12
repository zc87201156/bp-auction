package com.bp.auction.server.controller.response;

import com.bp.auction.common.dal.entity.Auction;
import lombok.Data;

import java.math.BigDecimal;

/**
 * @author zwf
 */
@Data
public class RecentAuctionRsp {

	private Long id;
	private Long userId;
	private String nickname;
	private String headImg;
	private BigDecimal price;
	private Long endTime;

	public RecentAuctionRsp(Auction auction) {
		this.id = auction.getId();
		this.userId = auction.getCurrentUserId();
		this.nickname = auction.getNickname();
		this.headImg = auction.getHeadImg();
		this.price = auction.getCurrentPrice();
		this.endTime = auction.getEndTime().getTime();
	}
}
