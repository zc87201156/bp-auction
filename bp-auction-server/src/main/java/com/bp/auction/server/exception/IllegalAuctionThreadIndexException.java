package com.bp.auction.server.exception;

/**
 * 无效的游戏线程索引异常
 * @author zwf
 */
public class IllegalAuctionThreadIndexException extends Exception {

	public IllegalAuctionThreadIndexException(long auctionId, int index) {
		super("thread not exist because of thread index " + index + " illegal. auctionId:" + auctionId);
	}
}
