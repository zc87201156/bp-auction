package com.bp.auction.admin.service;


import com.bp.auction.admin.dal.mapper.ConfigMapper;
import com.bp.auction.common.constants.ChannelConstants;
import com.bp.auction.common.constants.ConfigConstants;
import com.bp.auction.common.constants.RedisChannelKey;
import com.bp.auction.common.dal.entity.Config;
import com.bp.auction.common.pubsub.PublishService;
import com.bp.auction.common.pubsub.message.ConfigMessage;
import com.bp.auction.common.pubsub.message.Message;
import com.bp.core.base.BaseServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * @author zc
 * @create 2019-02-15 20:16
 * @desc 配置项
 **/
@Service
public class ConfigService extends BaseServiceImpl<ConfigMapper, Config> {
    @Autowired
    private PublishService publishService;

    @Override
    protected void clearCache(Config entity) {
        //通知其他服务器清理配置缓存
        Message msg = new ConfigMessage(entity.getName());
        publishService.publish(RedisChannelKey.DEFAULT.key(), msg);
    }

    /**
     * 根据name获取配置项
     *
     * @param name
     * @return
     */
    public Config findByName(String name) {
        return baseMapper.findByName(name);
    }
}
