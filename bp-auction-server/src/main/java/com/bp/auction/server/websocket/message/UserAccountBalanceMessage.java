package com.bp.auction.server.websocket.message;

import com.bp.auction.server.websocket.AbstractMessage;
import com.bp.auction.server.websocket.MessageDef;
import com.bp.auction.server.websocket.protobuf.ProtocolDataModel;
import com.google.protobuf.GeneratedMessageV3;

/**
 * 用户账户余额响应
 * @author zwf
 */
public class UserAccountBalanceMessage extends AbstractMessage<ProtocolDataModel.UserAccountBalanceRes> {

	/**
	 * 账户余额
	 */
	private long balance;

	public UserAccountBalanceMessage(long balance) {
		super(MessageDef.USER_ACCOUNT_BALANCE_RESPONSE);
		this.balance = balance;
	}

	@Override
	protected GeneratedMessageV3.Builder writeBuilder() {
		ProtocolDataModel.UserAccountBalanceRes.Builder builder = ProtocolDataModel.UserAccountBalanceRes.newBuilder();
		builder.setBalance(balance);

		return builder;
	}
}
