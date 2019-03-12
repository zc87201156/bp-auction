package com.bp.auction.server.cache;

import com.bp.core.cache.LRUCache;
import com.bp.platform.rpc.dto.UserDto;


import java.util.Map;

/**
 * 用户信息本地缓存.在用户登录和断开链接时维护用户信息
 *
 * @author zwf
 */
public class UserInfoCache {

    /**
     * 用户信息缓存
     */
    private static final Map<Long, UserDto> USER_CACHE = new LRUCache<>(1000);

    /**
     * 用户贵族等级缓存
     */
    private static final Map<Long, Integer> VIP_LEVEL_CACHE = new LRUCache<>(1000);

    /**
     * 从本地缓存中获取用户信息
     *
     * @param userId 用户id
     * @return
     */
    public static UserDto getByUserId(long userId) {
        return USER_CACHE.get(userId);
    }

    /**
     * 从本地缓存中获取用户的贵族等级
     *
     * @param userId 用户id
     * @return
     */
    public static Integer getVipLevelByUserId(long userId) {
        return VIP_LEVEL_CACHE.get(userId);
    }

    /**
     * 添加用户信息到本地缓存中
     *
     * @param user 用户信息
     */
    public static void addUser(UserDto user) {
        if (user != null && user.getId() != null) {
            USER_CACHE.put(user.getId(), user);
        }
    }

    /**
     * 添加贵族等级到本地缓存中
     *
     * @param userId   用户id
     * @param vipLevel 用户贵族等级
     */
    public static void addUserVipLevel(long userId, Integer vipLevel) {
        VIP_LEVEL_CACHE.put(userId, vipLevel);
    }
}
