package com.bp.auction.common.constants;

import com.bp.auction.common.util.SysUtil;
import com.bp.core.cache.CacheKey;

/**
 * Redis订阅频道
 *
 * @author zwf
 */
public enum RedisChannelKey implements CacheKey {
    /**
     * 默认订阅频道
     */
    DEFAULT;

    private final String value;


    RedisChannelKey() {
        this.value = "AUCTION:" + SysUtil.getEnvironment().getValue() + ":CHANNEL:" + name();
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

    public static RedisChannelKey getByValue(String channel) {
        for (RedisChannelKey redisChannelKey : values()) {
            if (channel.equals(redisChannelKey.name())) {
                return redisChannelKey;
            }
        }
        return null;
    }

}
