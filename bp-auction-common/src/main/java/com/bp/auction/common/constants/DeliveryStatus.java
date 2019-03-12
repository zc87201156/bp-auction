package com.bp.auction.common.constants;

/**
 * 发货状态
 * @author zwf
 */
public enum DeliveryStatus {
	UNSEND(0,"未发放"),
	WAIT(1, "待领取"),
	AUDITING(2, "审核中"),
	SEND(3, "已发放")
	;

	private int value;
	private String label;

	DeliveryStatus(int value, String label) {
		this.value = value;
		this.label = label;
	}

	/**
	 * 返回该发货状态的int值
	 * @return
	 */
	public int getValue() {
		return value;
	}

	/**
	 * 返回该发货状态的文字描述
	 * @return
	 */
	public String getLabel() {
		return label;
	}

	/**
	 * 返回指定int值的发货状态
	 * @param value int值
	 * @return
	 */
	public static DeliveryStatus getByValue(int value) {
		for (DeliveryStatus ds : values()) {
			if (ds.value == value) {
				return ds;
			}
		}
		return null;
	}
}
