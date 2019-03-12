package com.bp.auction.server.rpc;

import com.bp.auction.rpc.AuctionHelloWorld;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.context.config.annotation.RefreshScope;
import org.springframework.web.bind.annotation.RestController;

/**
 * 类名称：AuctionHelloWorldImpl
 * 类描述：
 * 开发人：朱水平【Tank】
 * 创建时间：2019/1/15.11:26
 * 修改备注：
 *
 * @author Tank
 * @version 1.0.0
 */
@RestController
@RefreshScope
public class AuctionHelloWorldImpl implements AuctionHelloWorld {
    @Override
    public boolean isBlackIp(String ip) {
        return false;
    }

    @Override
    public boolean isBlackDevice(String device) {
        return false;
    }
}
