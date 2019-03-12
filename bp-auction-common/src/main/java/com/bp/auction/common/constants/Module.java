package com.bp.auction.common.constants;

/**
 * 项目模块
 * @author zwf
 */
public enum Module {

	API("api"),
	MQC("mqc"),
	ADMIN("admin"),
	TASK("task"),
	;

	private String value;

	Module(String value) {
		this.value = value;
	}

	/**
	 * 返回指定项目模块的值
	 * @return
	 */
	public String getValue() {
		return value;
	}

	/**
	 * 返回指定value值的项目模块
	 * @param value 值
	 * @return
	 */
	public static Module getByValue(String value) {
		for (Module m : values()) {
			if (m.value.equals(value)) {
				return m;
			}
		}
		return null;
	}
}
