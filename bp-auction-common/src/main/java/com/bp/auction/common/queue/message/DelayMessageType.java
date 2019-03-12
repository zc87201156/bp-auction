package com.bp.auction.common.queue.message;

import com.bp.auction.common.util.SysUtil;

/**
 * 延迟消息类型
 * @author zwf
 */
public enum DelayMessageType {
	/**
	 * 拍卖开始
	 */
	START_AUCTION,
	/**
	 * 拍卖结束
	 */
	END_AUCTION,
	/**
	 * 托管出价
	 */
	DEPOSIT_AUCTION;

	public String key(Object...params){
		StringBuilder key = new StringBuilder("AUCTION:" + SysUtil.getEnvironment().getValue() + ":DELAY_MESSAGE:" + name());
		if (params != null && params.length > 0) {
			for (Object param : params) {
				if(param == null){
					continue;
				}
				key.append(':');
				key.append(String.valueOf(param));
			}
		}
		return key.toString();
	}
}