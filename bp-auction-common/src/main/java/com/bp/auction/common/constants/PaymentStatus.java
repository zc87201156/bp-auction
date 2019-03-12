package com.bp.auction.common.constants;

/**
 * 支付状态
 * @author zwf
 */
public enum PaymentStatus {
	UNPAID(0, "未支付"),
	SUCCESS(1, "已支付"),
	;

	private int value;

	private String label;

	PaymentStatus(int value, String label) {
		this.value = value;
		this.label = label;
	}

	/**
	 * 返回该支付状态的int值
	 * @return
	 */
	public int getValue() {
		return value;
	}

	/**
	 * 返回该支付状态的文字描述
	 * @return
	 */
	public String getLabel() {
		return label;
	}

	/**
	 * 返回指定int值的支付状态
	 * @param value int值
	 * @return
	 */
	public static PaymentStatus getByValue(int value) {
		for (PaymentStatus ps : values()) {
			if (ps.value == value) {
				return ps;
			}
		}
		return null;
	}
}
