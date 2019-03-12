package com.bp.auction.server.controller;

import com.bp.auction.server.service.ConfigService;
import com.bp.auction.server.service.MarqueeService;
import com.bp.core.response.ResponseBean;
import com.bp.core.web.base.BaseController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

/**
 * 跑马灯
 */
@RestController
@RequestMapping("/auction/api/marquee")
public class MarqueeController extends BaseController {

    @Autowired
    private ConfigService configService;

    @Autowired
    private MarqueeService marqueeService;

    /**
     * 跑马灯列表
     *
     * @return
     */
    @RequestMapping("/list")
    public ResponseBean<Map<String, Object>> getMarquee() {
        Map<String, Object> result = new HashMap<>(2);
        result.put("max", configService.getMarqueeNum());
        result.put("list", marqueeService.getMarquee());
        return responseSuccess(result);
    }
}
