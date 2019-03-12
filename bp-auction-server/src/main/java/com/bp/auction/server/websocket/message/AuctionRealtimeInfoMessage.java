package com.bp.auction.server.websocket.message;

import com.bp.auction.server.websocket.AbstractMessage;
import com.bp.auction.server.websocket.MessageDef;
import com.bp.auction.server.websocket.protobuf.ProtocolDataModel;
import com.google.protobuf.GeneratedMessageV3;

/**
 * 拍卖实时信息响应
 * @author zwf
 */
public class AuctionRealtimeInfoMessage extends AbstractMessage<ProtocolDataModel.AuctionRealtimeInfoRes> {

	/**
	 * 拍卖id
	 */
	private long auctionId;

	/**
	 * 围观人次
	 */
	private Integer onlookerCount;

	/**
	 * 出价人数
	 */
	private Integer auctionUserCount;

	public AuctionRealtimeInfoMessage(long auctionId, Integer onlookerCount, Integer auctionUserCount) {
		super(MessageDef.AUCTION_REALTIME_INFO_RESPONSE);
		this.auctionId = auctionId;
		this.onlookerCount = onlookerCount;
		this.auctionUserCount = auctionUserCount;
	}

	@Override
	protected GeneratedMessageV3.Builder writeBuilder() {
		ProtocolDataModel.AuctionRealtimeInfoRes.Builder builder = ProtocolDataModel.AuctionRealtimeInfoRes.newBuilder();
		builder.setAuctionId(auctionId);
		if (onlookerCount != null) {
			builder.setOnlookerCount(onlookerCount);
		}
		if (auctionUserCount != null) {
			builder.setAuctionUserCount(auctionUserCount);
		}

		return builder;
	}
}
