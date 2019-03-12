package com.bp.auction.common.constants;

/**
 * 榜单类型
 *
 * @author zc
 */
public enum RankType {
    /**
     * 杠神榜
     */
    KILLER(1),
    /**
     * 拍神榜
     */
    KING(2);

    private int value;

    RankType(int value) {
        this.value = value;
    }

    public int getValue() {
        return value;
    }

    public static RankType getByRankType(int rankType) {
        for (RankType r : RankType.values()) {
            if (r.value == rankType) {
                return r;
            }
        }
        return null;
    }
}
