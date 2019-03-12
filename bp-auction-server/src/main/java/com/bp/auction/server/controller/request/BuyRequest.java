package com.bp.auction.server.controller.request;

import com.alibaba.fastjson.JSONObject;
import lombok.Data;

/**
 * 商城购买
 * Created by chris on 2018/10/08.
 */
@Data
public class BuyRequest<T> extends SourceRequest {
    private T value;
    private Integer payType;
    private String thirdSn;
    private String account;
    private String recepit;

    @Override
    public String toString() {
        return JSONObject.toJSONString(this);
    }
}
