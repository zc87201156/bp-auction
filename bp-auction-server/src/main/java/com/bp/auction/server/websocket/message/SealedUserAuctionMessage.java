package com.bp.auction.server.websocket.message;

import com.bp.auction.server.websocket.AbstractMessage;
import com.bp.auction.server.websocket.MessageDef;
import com.bp.auction.server.websocket.protobuf.ProtocolDataModel;
import com.google.protobuf.GeneratedMessageV3;

/**
 * 暗拍场用户出价(调整价格)响应
 * @author zwf
 */
public class SealedUserAuctionMessage extends AbstractMessage<ProtocolDataModel.SealedUserAuctionRes> {

	/**
	 * 拍卖id
	 */
	private long auctionId;

	/**
	 * 用户昵称
	 */
	private String nickname;

	/**
	 * 是否首次出价
	 */
	private boolean first;


	public SealedUserAuctionMessage(long auctionId, String nickname, boolean first) {
		super(MessageDef.SEALED_USER_AUCTION_RESPONSE);
		this.auctionId = auctionId;
		this.nickname = nickname;
		this.first = first;
	}

	@Override
	protected GeneratedMessageV3.Builder writeBuilder() {
		ProtocolDataModel.SealedUserAuctionRes.Builder builder = ProtocolDataModel.SealedUserAuctionRes.newBuilder();
		builder.setAuctionId(auctionId);
		if (nickname != null) {
			builder.setNickname(nickname);
		}
		builder.setFirst(first);
		return builder;
	}
}
