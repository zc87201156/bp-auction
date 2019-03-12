package com.bp.auction.common.constants;

import com.bp.core.cache.CacheKey;

/**
 *
 * @author zk
 * @date 2017/10/20
 */
public enum OauthCacheKey implements CacheKey {

    /**
     * 根据token获取用户信息
     */
    OAUTH2_TOKEN_INFO,
    /**
     * 渠道信息
     */
    CHANNEL_INFO,
    /**
     * 父渠道信息
     */
    PARENT_CHANNEL_INFO,
    ;
    private final String value;

    OauthCacheKey() {
        this.value = "AUCTION:OAUTH:" + name();
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
