package com.bp.auction.common.constants;

/***
 * 通用的 关于是或否字段的值
 */
public enum YesOrNo {
    YES(1,"是"),
    NO(0,"否");

    private int value;

    private String label;

    YesOrNo(int value, String label) {
        this.value = value;
        this.label = label;
    }

    public int getValue() {
        return value;
    }

    public String getLabel() {
        return label;
    }

    public static YesOrNo getByValue(int value){
        for(YesOrNo yesOrNo:values()){
            if(yesOrNo.value==value){
                return yesOrNo;
            }
        }
        return null;
    }
}
