package com.bp.auction.server.service.bo;

import com.bp.auction.common.constants.*;
import com.bp.core.utils.type.BigDecimalUtil;
import org.apache.commons.lang3.builder.ReflectionToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Date;

/**
 * 拍卖信息
 * @author zwf
 */
public class AuctionInfo implements Serializable {

	private static final long serialVersionUID = 1L;

	/**
	 * 拍卖id
	 */
	private Long id;
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
	private AuctionStatus auctionStatus;
	/**
	 * 支付状态
	 */
	private PaymentStatus paymentStatus;
    /***
     * 禁用状态
     */
	private Status status;
	/**
	 * 支付订单号
	 */
	private String paymentOrderNo;
	/**
	 * 支付时间
	 */
	private Date paymentTime;
	/**
	 * 下一期拍卖id
	 */
	private Long nextId;
	/**
	 * 商品编号
	 */
	private String goodsNo;
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
	 * 拍卖配置类型
	 */
    private AuctionType type;
	/**
	 * 滚拍id
	 */
    private Long rollAuctionId;
	/**
	 * 场次类型
	 */
	private AuctionClass auctionClass;
    /***
     * 是否支持托管(给个默认值 yes)
     */
	private YesOrNo canDeposit;
	/**
	 * 免手续费场的报名费
	 */
	private Long freeEntryFee;
	/**
	 * 免手续费场的加价幅度
	 */
	private BigDecimal freeRaisePrice;
	/**
	 * 累计出价次数
	 */
	private long auctionTimes;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getGoodsId() {
        return goodsId;
    }

    public void setGoodsId(Long goodsId) {
        this.goodsId = goodsId;
    }

    public Date getStartTime() {
        return startTime;
    }

    public void setStartTime(Date startTime) {
        this.startTime = startTime;
    }

    public Date getEndTime() {
        return endTime;
    }

    public void setEndTime(Date endTime) {
        this.endTime = endTime;
    }

    public BigDecimal getCurrentPrice() {
    	BigDecimal num;
    	switch (this.auctionClass){
    		//免手续场取免手续费的加价幅度
			case FREE_AUCTION_FEE:
				num = freeRaisePrice == null ? BigDecimal.valueOf(0) : BigDecimalUtil.mul(freeRaisePrice, BigDecimal.valueOf(auctionTimes));
				break;
			default:
				num = auctionFeePrice == null ? BigDecimal.valueOf(0) : BigDecimalUtil.mul(auctionFeePrice, BigDecimal.valueOf(auctionTimes));
		}
		//商品当前价格=起拍价+加价幅度*加价次数
		return BigDecimalUtil.add(startPrice, num);
	}

    public void setCurrentPrice(BigDecimal currentPrice) {
        this.currentPrice = currentPrice;
    }

    public Long getCurrentUserId() {
        return currentUserId;
    }

    public void setCurrentUserId(Long currentUserId) {
        this.currentUserId = currentUserId;
    }

    public String getNickname() {
        return nickname;
    }

    public void setNickname(String nickname) {
        this.nickname = nickname;
    }

    public String getHeadImg() {
        return headImg;
    }

    public void setHeadImg(String headImg) {
        this.headImg = headImg;
    }

	public Integer getVipLevel() {
		return vipLevel;
	}

    public void setVipLevel(Integer vipLevel) {
        this.vipLevel = vipLevel;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public Date getPaymentEndTime() {
        return paymentEndTime;
    }

    public void setPaymentEndTime(Date paymentEndTime) {
        this.paymentEndTime = paymentEndTime;
    }

    public AuctionStatus getAuctionStatus() {
        return auctionStatus;
    }

    public void setAuctionStatus(AuctionStatus auctionStatus) {
        this.auctionStatus = auctionStatus;
    }

    public PaymentStatus getPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(PaymentStatus paymentStatus) {
        this.paymentStatus = paymentStatus;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public String getPaymentOrderNo() {
        return paymentOrderNo;
    }

    public void setPaymentOrderNo(String paymentOrderNo) {
        this.paymentOrderNo = paymentOrderNo;
    }

    public Date getPaymentTime() {
        return paymentTime;
    }

    public void setPaymentTime(Date paymentTime) {
        this.paymentTime = paymentTime;
    }

    public Long getNextId() {
        return nextId;
    }

    public void setNextId(Long nextId) {
        this.nextId = nextId;
    }

    public String getGoodsNo() {
        return goodsNo;
    }

    public void setGoodsNo(String goodsNo) {
        this.goodsNo = goodsNo;
    }

    public String getGoodsName() {
        return goodsName;
    }

    public void setGoodsName(String goodsName) {
        this.goodsName = goodsName;
    }

    public String getDefaultGoodsImage() {
        return defaultGoodsImage;
    }

    public void setDefaultGoodsImage(String defaultGoodsImage) {
        this.defaultGoodsImage = defaultGoodsImage;
    }

    public String getGoodsImages() {
        return goodsImages;
    }

    public void setGoodsImages(String goodsImages) {
        this.goodsImages = goodsImages;
    }

    public BigDecimal getMarketPrice() {
        return marketPrice;
    }

    public void setMarketPrice(BigDecimal marketPrice) {
        this.marketPrice = marketPrice;
    }

    public BigDecimal getStartPrice() {
        return startPrice;
    }

    public void setStartPrice(BigDecimal startPrice) {
        this.startPrice = startPrice;
    }

	public Long getAuctionFee() {
		return auctionFee;
	}

	public void setAuctionFee(Long auctionFee) {
		this.auctionFee = auctionFee;
	}

	public BigDecimal getAuctionFeePrice() {
		return auctionFeePrice;
	}

	public void setAuctionFeePrice(BigDecimal auctionFeePrice) {
		this.auctionFeePrice = auctionFeePrice;
	}

	public AuctionType getType() {
        return type;
    }

    public void setType(AuctionType type) {
        this.type = type;
    }

    public Long getRollAuctionId() {
        return rollAuctionId;
    }

    public void setRollAuctionId(Long rollAuctionId) {
        this.rollAuctionId = rollAuctionId;
    }

	public AuctionClass getAuctionClass() {
		return auctionClass;
	}

	public void setAuctionClass(AuctionClass auctionClass) {
		this.auctionClass = auctionClass;
	}

	public YesOrNo getCanDeposit() {
        return canDeposit;
    }

    public void setCanDeposit(YesOrNo canDeposit) {
        this.canDeposit = canDeposit;
    }

	public Long getFreeEntryFee() {
		return freeEntryFee;
	}

	public void setFreeEntryFee(Long freeEntryFee) {
		this.freeEntryFee = freeEntryFee;
	}

	public BigDecimal getFreeRaisePrice() {
		return freeRaisePrice;
	}

	public void setFreeRaisePrice(BigDecimal freeRaisePrice) {
		this.freeRaisePrice = freeRaisePrice;
	}

	public long getAuctionTimes() {
		return auctionTimes;
	}

	public void setAuctionTimes(long auctionTimes) {
		this.auctionTimes = auctionTimes;
	}

	@Override
	public String toString() {
		return ReflectionToStringBuilder.toString(this, ToStringStyle.SHORT_PREFIX_STYLE);
	}
}
