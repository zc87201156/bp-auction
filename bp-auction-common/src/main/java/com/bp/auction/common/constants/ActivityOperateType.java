package com.bp.auction.common.constants;

/**
 * @author zc
 * @create 2019-01-22 13:36
 * @desc 活动获得奖励的方式
 **/
public enum ActivityOperateType {
    LOGIN(0, "每日登陆"),

    AUCTION(1, "拍卖出价");

    private int value;

    private String label;

    ActivityOperateType(int value, String label) {
        this.value = value;
        this.label = label;
    }

    public int getValue() {
        return value;
    }

    public String getLabel() {
        return label;
    }

    public static ActivityOperateType getByValue(int value) {
        for (ActivityOperateType operateType : values()) {
            if (value == operateType.value) {
                return operateType;
            }
        }
        return null;
    }
}
