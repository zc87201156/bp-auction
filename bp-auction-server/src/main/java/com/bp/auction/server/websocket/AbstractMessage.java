package com.bp.auction.server.websocket;

import com.bp.auction.common.constants.ErrorCode;
import com.bp.auction.server.websocket.protobuf.ProtocolDataModel;
import com.google.protobuf.GeneratedMessageV3;

/**
 * 响应消息基类
 */
public abstract class AbstractMessage<T extends GeneratedMessageV3> {

	private ProtocolDataModel.ProtocolData.Builder protocolDataBuilder;

    public AbstractMessage(int protocolId) {
		this(protocolId, ErrorCode.SUCCESS);
	}

	public AbstractMessage(int protocolId, int code) {
		protocolDataBuilder = ProtocolDataModel.ProtocolData.newBuilder();
		protocolDataBuilder.setProtocolId(protocolId);
		protocolDataBuilder.setCode(code);
	}

	/**
	 * 具体协议对象数据的写入
	 * @return
	 */
	protected abstract T.Builder writeBuilder();

	/**
	 * 返回protobuf序列化后的二进制字节数组
	 * @return
	 */
	public byte[] toByteArray() {
		T.Builder builder = writeBuilder();
		if (builder != null) {
			protocolDataBuilder.setBody(builder.build().toByteString());
		}
		protocolDataBuilder.setSendTime(System.currentTimeMillis());
		return protocolDataBuilder.build().toByteArray();
	}
}
