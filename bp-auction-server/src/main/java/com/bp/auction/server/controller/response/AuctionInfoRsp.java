package com.bp.auction.server.controller.response;

import com.bp.auction.common.constants.AuctionClass;
import com.bp.auction.common.constants.PaymentStatus;
import com.bp.auction.common.constants.YesOrNo;
import com.bp.auction.server.service.bo.AuctionInfo;
import com.bp.auction.server.service.bo.AuctionUserInfo;
import lombok.Data;

import java.math.BigDecimal;
import java.util.Date;

/**
 * @author zwf
 */
@Data
public class AuctionInfoRsp {
	/**
	 * 拍卖id
	 */
	private Long auctionId;
	/**
	 * 商品id
	 */
	private Long goodsId;
	/**
	 * 拍卖开始时间
	 */
	private Date startTime;
	/**
	 * 拍卖(预计)结束时间
	 */
	private Date endTime;
	/**
	 * 当前(成交)价格
	 */
	private BigDecimal currentPrice;
	/**
	 * 当前竞拍人(成交人)
	 */
	private Long currentUserId;
	/**
	 * 当前竞拍人(成交人)昵称
	 */
	private String nickname;
	/**
	 * 当前竞拍人(成交人)头像
	 */
	private String headImg;
	/**
	 * 当前竞拍人(成交人)贵族等级
	 */
	private Integer vipLevel;
	/**
	 * 当前竞拍人(成交人)所在城市
	 */
	private String city;
	/**
	 * 支付截止时间
	 */
	private Date paymentEndTime;
	/**
	 * 拍卖状态
	 */
	private Integer status;
	/**
	 * 支付状态
	 */
	private Integer paymentStatus;
	/**
	 * 支付时间
	 */
	private Date paymentTime;
	/**
	 * 下一期拍卖id
	 */
	private Long nextAuctionId;
	/**
	 * 商品名称
	 */
	private String goodsName;
	/**
	 * 默认商品图片
	 */
	private String defaultGoodsImage;
	/**
	 * 商品轮播图列表(逗号隔开)
	 */
	private String goodsImages;
	/**
	 * 市场价
	 */
	private BigDecimal marketPrice;
	/**
	 * 起拍价
	 */
	private BigDecimal startPrice;
	/**
	 * 商品的手续费
	 */
	private Long auctionFee;
	/**
	 * 商品的手续费抬价
	 */
	private BigDecimal auctionFeePrice;
	/**
	 * 场次是否支持托管
	 */
	private Integer canDeposit;
	/**
	 * 场次类型
	 */
	private Integer auctionClass;
	/**
	 * 免手续费场报名费
	 */
	private Long freeEntryFee;
	/**
	 * 免手续费场抬价幅度
	 */
	private BigDecimal freeRaisePrice;

	public AuctionInfoRsp(AuctionUserInfo au) {
		//this.auctionId = au.getAuctionId();
		this.defaultGoodsImage = au.getDefaultGoodsImage();
		this.goodsName = au.getGoodsName();
		this.currentPrice = au.getPrice();
		this.paymentEndTime = new Date();
		this.paymentStatus = PaymentStatus.SUCCESS.getValue();
	}

	public AuctionInfoRsp(AuctionInfo auctionInfo) {
		this.auctionId = auctionInfo.getId();
		this.goodsId = auctionInfo.getGoodsId();
		this.startTime = auctionInfo.getStartTime();
		this.endTime = auctionInfo.getEndTime();
		this.currentUserId = auctionInfo.getCurrentUserId();
		this.currentPrice = auctionInfo.getCurrentPrice();
		this.nickname = auctionInfo.getNickname();
		this.headImg = auctionInfo.getHeadImg();
		this.vipLevel = auctionInfo.getVipLevel();
		this.city = auctionInfo.getCity();
		this.paymentEndTime = auctionInfo.getPaymentEndTime();
		this.status = auctionInfo.getAuctionStatus().getValue();
		this.paymentStatus = auctionInfo.getPaymentStatus().getValue();
		this.paymentTime = auctionInfo.getPaymentTime();
		this.nextAuctionId = auctionInfo.getNextId();
		this.goodsName = auctionInfo.getGoodsName();
		this.defaultGoodsImage = auctionInfo.getDefaultGoodsImage();
		this.goodsImages = auctionInfo.getGoodsImages();
		this.marketPrice = auctionInfo.getMarketPrice();
		this.startPrice = auctionInfo.getStartPrice();
		this.auctionFee = auctionInfo.getAuctionFee();
		this.auctionFeePrice = auctionInfo.getAuctionFeePrice();
		//兼容线上的(防止由于线上缓存没有此字段，报错，给默认值）
		this.canDeposit=auctionInfo.getCanDeposit()==null? YesOrNo.YES.getValue():auctionInfo.getCanDeposit().getValue();
		//场次类型
		if (auctionInfo.getAuctionClass() != null) {
			this.auctionClass = auctionInfo.getAuctionClass().getValue();
		} else {
			this.auctionClass = AuctionClass.COMMON.getValue();
		}
		this.freeEntryFee = auctionInfo.getFreeEntryFee();
		this.freeRaisePrice = auctionInfo.getFreeRaisePrice();
	}


}
