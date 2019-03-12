package com.bp.auction.server.websocket.message;

import com.bp.auction.server.websocket.AbstractMessage;
import com.bp.auction.server.websocket.MessageDef;
import com.bp.auction.server.websocket.protobuf.ProtocolDataModel;
import com.google.protobuf.GeneratedMessageV3;

import java.math.BigDecimal;

/**
 * 跑马灯响应
 * @author zwf
 */
public class MarqueeMessage extends AbstractMessage<ProtocolDataModel.MarqueeRes> {

	/**
	 * 用户昵称
	 */
	private String nickname;

	/**
	 * 商品名称
	 */
	private String goodsName;

	/**
	 * 成交价格
	 */
	private BigDecimal price;

	public MarqueeMessage(String nickname, String goodsName, BigDecimal price) {
		super(MessageDef.MARQUEE_RESPONSE);
		this.nickname = nickname;
		this.goodsName = goodsName;
		this.price = price;
	}

	@Override
	protected GeneratedMessageV3.Builder writeBuilder() {
		ProtocolDataModel.MarqueeRes.Builder builder = ProtocolDataModel.MarqueeRes.newBuilder();
		if (nickname != null) {
			builder.setNickname(nickname);
		}
		if(goodsName!=null) {
			builder.setGoodsName(goodsName);
		}
		if (price != null) {
			builder.setPrice(price.doubleValue());
		}

		return builder;
	}
}
