package com.bp.auction.server.controller.request;

import lombok.Data;

/**
 * 有来源的请求
 *
 * @author Fe 2016年9月19日
 */
@Data
public class SourceRequest {
    private Integer source;
    private Long userId;
}
