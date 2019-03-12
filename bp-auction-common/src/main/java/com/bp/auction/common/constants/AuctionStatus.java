package com.bp.auction.common.constants;

/**
 * 拍卖状态
 * @author zwf
 */
public enum AuctionStatus {

	NO_AUCTION(0, "拍卖未开始"),
	AUCTIONING(1, "拍卖中"),
	SUCCESS(2, "拍卖成交"),
	FAILED(3, "流拍")
	;

	private int value;
	private String label;

	AuctionStatus(int value, String label) {
		this.value = value;
		this.label = label;
	}

	/**
	 * 返回该拍卖状态的int值
	 * @return
	 */
	public int getValue() {
		return value;
	}

	/**
	 * 返回该拍卖状态的文字描述
	 * @return
	 */
	public String getLabel() {
		return label;
	}

	/**
	 * 返回指定int值的拍卖状态
	 * @param value int值
	 * @return
	 */
	public static AuctionStatus getByValue(int value) {
		for (AuctionStatus as : values()) {
			if (as.value == value) {
				return as;
			}
		}
		return null;
	}
}
