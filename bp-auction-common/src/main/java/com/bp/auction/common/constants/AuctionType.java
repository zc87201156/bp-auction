package com.bp.auction.common.constants;

/***
 * 拍卖配置类型
 */
public enum AuctionType {
    MANUAL(0, "手动配置"),
    ROLL(1, "滚拍");
    private int value;
    private String label;

    public int getValue() {
        return value;
    }

    public String getLabel() {
        return label;
    }

    AuctionType(int value, String label) {
        this.value = value;
        this.label = label;
    }

    public static AuctionType getByValue(int value) {
        for (AuctionType auctionType : AuctionType.values()) {
            if (auctionType.getValue() == value) {
                return auctionType;
            }
        }
        return null;
    }
}
