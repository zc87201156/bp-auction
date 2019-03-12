package com.bp.auction.common.constants;

/***
 * 拍卖配置类型
 */
public enum OperateType {
    MANUAL(0, "自主操作"),
    DEPOSIT(1, "托管操作");
    private int value;
    private String label;

    public int getValue() {
        return value;
    }

    public String getLabel() {
        return label;
    }

    OperateType(int value, String label) {
        this.value = value;
        this.label = label;
    }

    public static OperateType getByValue(int value) {
        for (OperateType auctionType : OperateType.values()) {
            if (auctionType.getValue() == value) {
                return auctionType;
            }
        }
        return null;
    }
}
