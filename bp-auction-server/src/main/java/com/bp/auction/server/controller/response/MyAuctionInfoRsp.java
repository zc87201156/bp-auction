package com.bp.auction.server.controller.response;

import lombok.Data;

import java.io.Serializable;
import java.util.Date;

/**
 * 我的竞拍信息
 * @author zwf
 */
@Data
public class MyAuctionInfoRsp implements Serializable {

	private static final long serialVersionUID = 1L;

	private AuctionInfoRsp auctionInfo;

	private Integer auctionTimes;

	private Date firstAuctionTime;

	private Date lastAuctionTime;

	//针对于进行中的拍卖而言 是否有托管
	private Integer isDeposit;
}
