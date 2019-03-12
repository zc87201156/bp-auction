package com.bp.auction.common.constants;

/**
 * 拍卖事件类型
 *
 * @author zwf
 */
public enum AuctionEventType {
    /**
     * 更新拍卖
     */
    UPDATE_AUCTION,
    /**
     * 取消拍卖
     */
    CANCEL_AUCTION,
    /**
     * 拍卖开始
     */
    START_AUCTION,
    /**
     * 拍卖结束
     */
    END_AUCTION,
    /**
     * 用户出价
     */
    AUCTION,
    /***
     * 更新滚拍配置
     */
    UPDATE_ROLL_AUCTION,
    /***
     * 取消滚拍配置
     */
    CANCEL_ROLL_AUCTION


}
