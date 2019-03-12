package com.bp.auction.common.pubsub;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Component;

/**
 * 类名称：PublishService
 * 类描述：redis消息发布
 * 开发人：朱水平【Tank】
 * 创建时间：2019/1/2.12:17
 * 修改备注：
 *
 * @version 1.0.0
 */
@Component
public class PublishService {
    @Autowired
    RedisTemplate redisTemplate;

    public void publish(String channel, Object message) {
        //把消息发送到指定的通道
        redisTemplate.convertAndSend(channel, message);
    }
}
