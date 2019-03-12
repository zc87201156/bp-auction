package com.bp.auction.common.pubsub.message;

import com.alibaba.fastjson.JSONObject;
import com.bp.auction.common.constants.Environment;
import com.bp.auction.common.pubsub.MessageType;

import java.io.Serializable;

/**
 * Redis订阅消息
 *
 * @author zbp
 */
public abstract class Message implements Serializable {
    /**
     * 消息类型
     */
    private MessageType type;

    /**
     * 消息内容
     */
    private String content;

    public Message() {
    }
    
    public MessageType getType() {
        return type;
    }

    public void setType(MessageType type) {
        this.type = type;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String toJsonString() {
        return JSONObject.toJSONString(this);
    }
}
