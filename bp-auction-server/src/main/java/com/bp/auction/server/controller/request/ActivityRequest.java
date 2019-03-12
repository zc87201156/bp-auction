package com.bp.auction.server.controller.request;

import lombok.Data;

import javax.validation.constraints.NotNull;

/**
 * @author zc
 * @create 2019-01-22 18:06
 * @desc
 **/
@Data
public class ActivityRequest {
    /**
     * 活动ID
     */
    @NotNull(message = "活动ID不能为空")
    private Long activityId;

    /**
     * 榜单日期时间戳
     */
    @NotNull(message = "时间戳不能为空")
    private Long date;
}
