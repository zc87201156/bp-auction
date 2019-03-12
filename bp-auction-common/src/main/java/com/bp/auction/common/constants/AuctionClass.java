package com.bp.auction.common.constants;

/**
 * 拍卖场次
 * @author zwf
 */
public enum AuctionClass {
	COMMON(0, "普通场"),
	BEGINNER(1, "新小户场"),
	SMALL_USER(2, "小户场"),
	FREE_AUCTION_FEE(3, "免手续费场"),
	SEALED(4, "暗拍场"),
	;
	private int value;

	private String label;

	AuctionClass(int value, String label) {
		this.value = value;
		this.label = label;
	}

	/**
	 * 返回该拍卖场次的int值
	 * @return
	 */
	public int getValue() {
		return value;
	}

	/**
	 * 返回该拍卖场次的标签
	 * @return
	 */
	public String getLabel() {
		return label;
	}

	/**
	 * 返回指定int值的拍卖场次
	 * @param value int值
	 * @return
	 */
	public static AuctionClass getByValue(int value) {
		for (AuctionClass ac : values()) {
			if (ac.value == value) {
				return ac;
			}
		}
		return null;
	}
}
