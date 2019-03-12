package com.bp.auction.common.constants;

/**
 * 拍卖属性
 * @author zwf
 */
public enum Attribute {
	ONLOOKER_COUNT(1, AttributeType.INTEGER, "围观人数"),
	AUCTION_USER_COUNT(2, AttributeType.INTEGER, "出价人数"),
	;

	private int value;
	private AttributeType type;
	private String name;

	Attribute(int value, AttributeType type, String name) {
		this.value = value;
		this.type = type;
		this.name = name;
	}

	/**
	 * 返回该拍卖属性的int值
	 * @return
	 */
	public int getValue() {
		return value;
	}

	/**
	 * 返回该拍卖属性的类型
	 * @return
	 */
	public AttributeType getType() {
		return type;
	}

	/**
	 * 返回该拍卖属性的名称
	 * @return
	 */
	public String getName() {
		return name;
	}

	/**
	 * 获取指定int值的拍卖属性
	 * @param value int值
	 * @return
	 */
	public static Attribute getByValue(int value) {
		for (Attribute a : values()) {
			if (a.value == value) {
				return a;
			}
		}
		return null;
	}
}