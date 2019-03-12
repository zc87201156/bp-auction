package com.bp.auction.rpc;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

/**
 * 类名称：AuctionHelloWorld
 * 类描述：API 接口 demo
 * 开发人：朱水平【Tank】
 * 创建时间：2019/1/15.11:19
 * 修改备注：
 *
 * @author Tank
 * @version 1.0.0
 */
@FeignClient(value = "bp-auction-server")
public interface AuctionHelloWorld {

    /**
     * IP是否在黑名单
     * @param ip
     * @return
     */
    @PostMapping("isBlackIp")
    boolean isBlackIp(@RequestParam("ip") String ip);

    /**
     * 设备是否在黑名单
     * @param device
     * @return
     */
    @GetMapping("isBlackDevice/{device}")
    boolean isBlackDevice(@PathVariable String device);


}
