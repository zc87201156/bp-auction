package com.bp.auction.common.pubsub.message;


import com.bp.auction.common.pubsub.MessageType;
import com.bp.auction.common.util.SysUtil;


/**
 * @author zwf
 */
public class ConfigMessage extends Message {

    public ConfigMessage() {

    }

    public ConfigMessage(String configName) {
        setType(MessageType.CONFIG);
        setContent(configName);
    }
}
