package com.bp.auction.common.constants;

/**
 * 通用状态
 * @author zwf
 */
public enum Status {

	ENABLE(1, "启用"),
	DISABLE(0, "禁用")
	;

	private int value;

	private String label;

	Status(int value, String label) {
		this.value = value;
		this.label = label;
	}

	/**
	 * 返回该状态的int值
	 * @return
	 */
	public int getValue() {
		return value;
	}

	/**
	 * 返回该状态的文字描述
	 * @return
	 */
	public String getLabel() {
		return label;
	}

	/**
	 * 获取指定int值的状态
	 * @param value int值
	 * @return
	 */
	public static Status getByValue(int value) {
		for (Status status : values()) {
			if (status.value == value) {
				return status;
			}
		}
		return null;
	}
}
