package com.bp.auction.server.websocket.message;

import com.bp.auction.server.websocket.AbstractMessage;
import com.bp.auction.server.websocket.MessageDef;
import com.bp.auction.server.websocket.protobuf.ProtocolDataModel;
import com.google.protobuf.GeneratedMessageV3;

import java.util.Date;

/**
 * 拍卖开始响应
 * @author zwf
 */
public class StartAuctionMessage extends AbstractMessage<ProtocolDataModel.StartAuctionRes> {

	/**
	 * 拍卖id
	 */
	private long auctionId;

	/**
	 * 拍卖预计结束时间
	 */
	private Date endTime;

	public StartAuctionMessage(long auctionId, Date endTime) {
		super(MessageDef.START_AUCTION_RESPONSE);
		this.auctionId = auctionId;
		this.endTime = endTime;
	}

	@Override
	protected GeneratedMessageV3.Builder writeBuilder() {
		ProtocolDataModel.StartAuctionRes.Builder builder = ProtocolDataModel.StartAuctionRes.newBuilder();
		builder.setAuctionId(auctionId);
		if (endTime != null) {
			builder.setEndTime(endTime.getTime());
		}
		return builder;
	}
}
