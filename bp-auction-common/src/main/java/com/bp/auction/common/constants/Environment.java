package com.bp.auction.common.constants;

/**
 * 环境
 *
 * @author zwf
 */
public enum Environment {

    ONLINE(0, "正式环境"),
    GRAY(1, "灰度环境");

    private int value;
    private String label;

    Environment(int value, String label) {
        this.value = value;
        this.label = label;
    }

    /**
     * 返回该环境的int值
     *
     * @return
     */
    public int getValue() {
        return value;
    }

    /**
     * 返回该环境的名称
     *
     * @return
     */
    public String getLabel() {
        return label;
    }

    /**
     * 返回指定int值的环境
     *
     * @param value int值
     * @return
     */
    public static Environment getByValue(int value) {
        for (Environment e : values()) {
            if (e.value == value) {
                return e;
            }
        }
        return null;
    }

    public static Environment getByLabel(String name) {
        for (Environment e : values()) {
            if (e.name().equals(name)) {
                return e;
            }
        }
        return null;
    }


}
