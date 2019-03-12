package com.bp.auction.common.constants;

/***
 * 滚拍状态
 */
public enum RollAuctionStatus {
    NOT_END(0, "未结束"),

    ENDED(1, "已结束");

    private int value;

    private String label;

    RollAuctionStatus(int value, String label) {
        this.value = value;
        this.label = label;
    }

    public int getValue() {
        return value;
    }

    public String getLabel() {
        return label;
    }

    public static RollAuctionStatus getByValue(int value) {
        for (RollAuctionStatus rollAuctionStatus : RollAuctionStatus.values()) {
            if (value == rollAuctionStatus.getValue()) {
                return rollAuctionStatus;
            }
        }
        return null;
    }
}
