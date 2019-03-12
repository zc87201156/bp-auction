package com.bp.auction.server.service.bo;

import com.bp.auction.common.dal.entity.AuctionUser;
import lombok.Data;

import java.math.BigDecimal;
import java.util.Date;

/**
 * @author zwf
 */
@Data
public class AuctionUserInfo {

	private Integer kind;
	private Long auctionId;
	private Date lastAuctionTime;
	private String defaultGoodsImage;
	private String goodsName;
	private BigDecimal price;
	private Integer auctionTimes;

}
