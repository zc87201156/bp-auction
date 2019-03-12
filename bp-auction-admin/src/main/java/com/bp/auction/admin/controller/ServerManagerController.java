package com.bp.auction.admin.controller;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.bp.auction.admin.service.AuctionService;
import com.bp.auction.admin.service.ConfigService;
import com.bp.auction.admin.service.RollAuctionService;
import com.bp.auction.common.pubsub.PublishService;
import com.bp.core.utils.http.HttpUtils;
import com.bp.core.web.base.ExtJsController;
import org.apache.http.HttpResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 服务器管理
 *
 * @author zwf
 */
@RestController
@RequestMapping("/auction/admin/server")
public class ServerManagerController extends ExtJsController {
    private JSONObject newJsonObj(String name, Object value) {
        JSONObject jsonObj = new JSONObject();
        jsonObj.put("name", name);
        jsonObj.put("value", value);
        return jsonObj;
    }
}
