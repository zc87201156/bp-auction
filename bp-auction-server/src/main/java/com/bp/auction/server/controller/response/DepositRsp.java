package com.bp.auction.server.controller.response;

/**
 * @author zc
 * @create 2018-12-20 22:07
 * @desc 托管响应
 **/
public class DepositRsp {

    private long auctionId;

    private boolean cancel;

    public long getAuctionId() {
        return auctionId;
    }

    public boolean isCancel() {
        return cancel;
    }

    public DepositRsp(long auctionId, boolean cancel) {
        this.auctionId = auctionId;
        this.cancel = cancel;
    }
}
