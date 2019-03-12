package com.bp.auction.server.redis.pubsub.handler;


import com.bp.auction.common.pubsub.MessageHandler;
import com.bp.auction.common.pubsub.MessageType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * 消息处理工厂
 *
 * @author zwf
 */
@Component
public class MessageHandlerFactory {

    @Autowired
    private ConfigHandler configHandler;

    /**
     * 根据消息类型返回对应的消息处理器
     *
     * @param messageType 消息类型
     * @return
     */
    public MessageHandler getHandler(MessageType messageType) {
        switch (messageType) {
            case CONFIG:
                return configHandler;
        }
        throw new RuntimeException("can not find MessageHandler for messageType[" + messageType + "]");
    }
}
