package com.bp.auction.common.constants;

import com.bp.auction.common.util.SysUtil;
import com.bp.core.cache.CacheKey;

/**
 * WebSocket推送相关的redis key
 *
 * @author zwf
 */
public enum RedisWebSocketKey implements CacheKey {
    /**
     * 某场拍卖需推送的用户id
     */
    PUSH_USER_IDS_BY_AUCTION_ID,
    /***
     * 消息推送频道
     */
    PUSH_CHANNEL;

    private final String value;

    RedisWebSocketKey() {
        this.value = "AUCTION:" + SysUtil.getEnvironment().getValue() + ":WEBSOCKET:" + name();
    }

    @Override
    public String key() {
        return value;
    }

    public String key(Object... params) {
        StringBuilder key = new StringBuilder(value);
        if (params != null && params.length > 0) {
            for (Object param : params) {
                key.append(':');
                key.append(String.valueOf(param));
            }
        }
        return key.toString();
    }
}
