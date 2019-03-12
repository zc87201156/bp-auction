package com.bp.auction.server.exception;

/**
 * 拍卖没有线程异常
 * @author zwf
 */
public class AuctionHasNoThreadException extends Exception{

	public AuctionHasNoThreadException(long auctionId) {
		super("Auction[" + auctionId + "] has no thread.");
	}
}
