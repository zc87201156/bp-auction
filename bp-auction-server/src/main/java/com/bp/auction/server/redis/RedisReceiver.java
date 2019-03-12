package com.bp.auction.server.redis;

import com.bp.auction.common.constants.RedisChannelKey;
import com.bp.auction.common.pubsub.message.Message;
import com.bp.auction.common.pubsub.MessageHandler;
import com.bp.auction.common.util.SysUtil;
import com.bp.auction.server.redis.pubsub.handler.MessageHandlerFactory;
import com.bp.core.utils.GfJsonUtil;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang.exception.ExceptionUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.io.IOException;

/**
 * 类名称：RedisReceiver
 * 类描述：消息解析
 * 开发人：朱水平【Tank】
 * 创建时间：2019/1/2.10:48
 * 修改备注：
 *
 * @version 1.0.0
 */
@Component
@Slf4j
public class RedisReceiver {

    @Autowired
    private MessageHandlerFactory factory;

    public void receiveMessage(String message, String channel) throws IOException {
        log.info("收到消息 message:{} channel:{}", message, channel);
        if (StringUtils.isBlank(message) || StringUtils.isBlank(channel)) {
            return;
        }
        try {
            //目前只处理DEFAULT的消息
            if (channel.equals(RedisChannelKey.DEFAULT.key()) ) {
                Message msg = GfJsonUtil.parseObject(message, Message.class);
                MessageHandler handler = factory.getHandler(msg.getType());
                handler.process(msg.getContent());
            }
        } catch (Exception e) {
            log.error("deal redis message error. message:{}, ex={}", message, ExceptionUtils.getStackTrace(e));
        }
    }
}
