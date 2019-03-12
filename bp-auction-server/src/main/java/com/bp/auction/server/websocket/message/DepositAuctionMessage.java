package com.bp.auction.server.websocket.message;

import com.bp.auction.server.websocket.AbstractMessage;
import com.bp.auction.server.websocket.MessageDef;
import com.bp.auction.server.websocket.protobuf.ProtocolDataModel;
import com.google.protobuf.GeneratedMessageV3;

/***
 *
 */
public class DepositAuctionMessage extends AbstractMessage<ProtocolDataModel.DepositAuctionRes> {
    /**
     * 拍卖id
     */
    private long auctionId;
    /***
     * 当前已经成功委托出价次数
     */
    private int currentAuctionTimes;

    private int auctionPeriod;

    private long auctionFeeLimit;

    public DepositAuctionMessage(int code,long auctionId, int currentAuctionTimes, int auctionPeriod, long auctionFeeLimit) {
        super(MessageDef.DEPOSIT_AUCTION_RESPONSE,code);
        this.auctionId = auctionId;
        this.currentAuctionTimes = currentAuctionTimes;
        this.auctionPeriod = auctionPeriod;
        this.auctionFeeLimit = auctionFeeLimit;
    }

    @Override
    protected GeneratedMessageV3.Builder writeBuilder() {
        ProtocolDataModel.DepositAuctionRes.Builder builder = ProtocolDataModel.DepositAuctionRes.newBuilder();
        builder.setAuctionId(auctionId);
        builder.setCurrentAuctionTimes(currentAuctionTimes);
        builder.setAuctionPeriod(auctionPeriod);
        builder.setAuctionFeeLimit(auctionFeeLimit);
        return builder;
    }
}
