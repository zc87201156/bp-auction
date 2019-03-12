package com.bp.auction.server.websocket.message;

import com.bp.auction.common.constants.AuctionStatus;
import com.bp.auction.server.websocket.AbstractMessage;
import com.bp.auction.server.websocket.MessageDef;
import com.bp.auction.server.websocket.protobuf.ProtocolDataModel;
import com.google.protobuf.GeneratedMessageV3;

import java.math.BigDecimal;
import java.util.Date;

/**
 * 拍卖(结束)响应
 * @author zwf
 */
public class AuctionMessage extends AbstractMessage<ProtocolDataModel.AuctionRes> {

	private long auctionId;
	//下一期期次ID
	private Long nextAuctionId;
	private Date endTime;
	private BigDecimal currentPrice;
	private Long currentUserId;
	private String nickname;
	private String headImg;
	private Integer vipLevel;
	private AuctionStatus status;
	//是否是小户
	private Boolean smallUser;

	/**
	 *
	 * @param code 错误码
	 * @param auctionId 拍卖id
	 * @param endTime 拍卖预计结束时间
	 * @param currentPrice 当前价格
	 * @param currentUserId 当前出价人
	 * @param nickname 当前出价人昵称
	 * @param headImg 当前出价人头像
	 * @param vipLevel 当前出价人贵族等级
	 * @param city 当前出价人所属城市
	 * @param status 拍卖状态
	 * @param nextAuctionId 如果有下一期，代表下一期拍卖ID
	 * @param smallUser 是否是小户，true-是，false-否
	 */
	public AuctionMessage(int code, long auctionId , Date endTime, BigDecimal currentPrice, Long currentUserId,
						  String nickname, String headImg, Integer vipLevel, AuctionStatus status,
						  Long nextAuctionId, Boolean smallUser) {
		super(MessageDef.AUCTION_RESPONSE, code);
		this.auctionId = auctionId;
		this.endTime = endTime;
		this.currentPrice = currentPrice;
		this.currentUserId = currentUserId;
		this.nickname = nickname;
		this.headImg = headImg;
		this.vipLevel = vipLevel;
		this.status = status;
		this.nextAuctionId = nextAuctionId;
		this.smallUser = smallUser;
	}

	@Override
	protected GeneratedMessageV3.Builder writeBuilder() {
		ProtocolDataModel.AuctionRes.Builder builder = ProtocolDataModel.AuctionRes.newBuilder();
		builder.setAuctionId(auctionId);
		if(endTime != null) {
			builder.setEndTime(endTime.getTime());
		}
		if (currentPrice != null) {
			builder.setCurrentPrice(currentPrice.doubleValue());
		}
		if (currentUserId != null) {
			builder.setCurrentUserId(currentUserId);
		}
		if (nickname != null) {
			builder.setNickname(nickname);
		}
		if (headImg != null) {
			builder.setHeadImg(headImg);
		}
		if (vipLevel != null) {
			builder.setVipLevel(vipLevel);
		}
		if (status != null) {
			builder.setStatus(status.getValue());
		}
		if (nextAuctionId != null) {
			builder.setNextAuctionId(nextAuctionId);
		}
		if (smallUser != null) {
			builder.setSmallUser(smallUser);
		}
		return builder;
	}
}
