package com.bp.auction.common.constants;

/**
 * 拍卖属性类型
 * @author zwf
 */
public enum AttributeType {
	STRING(1),
	INTEGER(2),
	LONG(3),
	DOUBLE(4),
	FLOAT(5)
	;

	private int value;

	AttributeType(int value) {
		this.value = value;
	}

	/**
	 * 返回该拍卖属性的int值
	 * @return
	 */
	public int getValue() {
		return value;
	}

	/**
	 * 获取指定int值的拍卖属性
	 * @param value int值
	 * @return
	 */
	public static AttributeType getByValue(int value) {
		for (AttributeType aat : values()) {
			if (aat.value == value) {
				return aat;
			}
		}
		return null;
	}
}
