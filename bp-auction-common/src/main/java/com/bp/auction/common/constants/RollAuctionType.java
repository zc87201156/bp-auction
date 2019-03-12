package com.bp.auction.common.constants;

/**
 * 滚拍类型
 * @author zwf
 */
public enum RollAuctionType {
	COMMON(0, "普通滚拍"),
	BEGINNER(1, "新小户滚拍"),
	SMALL_USER(2, "小户滚拍"),
	FREE_AUCTION_FEE(3, "免手续费场"),
	;

	private int value;

	private String label;

	RollAuctionType(int value, String label) {
		this.value = value;
		this.label = label;
	}

	/**
	 * 返回该滚拍类型的int值
	 * @return
	 */
	public int getValue() {
		return value;
	}

	/**
	 * 返回该滚拍类型的标签
	 * @return
	 */
	public String getLabel() {
		return label;
	}

	/**
	 * 返回指定int值的滚拍类型
	 * @param value int值
	 * @return
	 */
	public static RollAuctionType getByValue(int value) {
		for (RollAuctionType t : values()) {
			if (t.value == value) {
				return t;
			}
		}
		return null;
	}
}
