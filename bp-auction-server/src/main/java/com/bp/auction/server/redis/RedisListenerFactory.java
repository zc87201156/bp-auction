package com.bp.auction.server.redis;


import com.bp.auction.common.constants.RedisChannelKey;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.listener.PatternTopic;
import org.springframework.data.redis.listener.RedisMessageListenerContainer;
import org.springframework.data.redis.listener.adapter.MessageListenerAdapter;

import java.util.ArrayList;
import java.util.List;

/**
 * 类名称：RedisSubListenerConfig
 * 类描述：
 * 开发人：朱水平【Tank】
 * 创建时间：2019/1/2.10:46
 * 修改备注：
 *
 * @version 1.0.0
 */
@Configuration
public class RedisListenerFactory {

    /**
     * 监听到消息被哪个方法处理
     */
    private static String RECEIVER_METHOD = "receiveMessage";

    /**
     * 主题可以自己定义
     */
    private static String TOPIC = "redis:websocket";

    //初始化监听器
    @Bean
    RedisMessageListenerContainer container(RedisConnectionFactory connectionFactory,
                                            MessageListenerAdapter listenerAdapter) {
        RedisMessageListenerContainer container = new RedisMessageListenerContainer();
        container.setConnectionFactory(connectionFactory);
        //主题可以传入多个。以列表形式
        List<PatternTopic> topicList = new ArrayList<>();
        for (RedisChannelKey key : RedisChannelKey.values()) {
            topicList.add(new PatternTopic(key.key()));
        }
        container.addMessageListener(listenerAdapter, topicList);
        return container;
    }

    /**
     * 利用反射来创建监听到消息之后的执行方法
     */

    @Bean
    MessageListenerAdapter listenerAdapter(RedisReceiver redisReceiver) {

        return new MessageListenerAdapter(redisReceiver, RECEIVER_METHOD);
    }
}
