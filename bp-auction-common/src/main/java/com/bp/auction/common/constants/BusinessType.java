package com.bp.auction.common.constants;

/**
 * 更新用户金叶子的业务类型
 * @author zwf
 */
public enum BusinessType {

	AUCTION_FEE(19001, "拍卖手续费"),
	AUCTION_AWARD(19002, "榜单奖励"),
	BEGINNER_AUCTION_FEE(19003, "新手引导手续费"),
	VIOLATION_USER_BAIL_FEE(19004, "违约用户保证金"),
	ACTIVITY_AWARD(19005,"活动奖励")
	;

	private int value;

	private String remark;

	BusinessType(int value, String remark) {
		this.value = value;
		this.remark = remark;
	}

	/**
	 * 返回此业务类型的int值
	 * @return
	 */
	public int getValue() {
		return this.value;
	}

	/**
	 * 返回此业务类型的文字描述
	 * @return
	 */
	public String getRemark() {
		return remark;
	}

	/**
	 * 返回指定int值的业务类型
	 * @param value int值
	 * @return
	 */
	public static BusinessType getByValue(int value) {
		for (BusinessType bt : BusinessType.values()) {
			if (bt.getValue() == value) {
				return bt;
			}
		}
		return null;
	}
}
