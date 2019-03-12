package com.bp.auction.server.redis.pubsub.handler;


import com.bp.auction.common.pubsub.MessageHandler;
import com.bp.auction.server.service.ConfigService;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang.StringUtils;
import org.apache.commons.lang.math.NumberUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * 配置项订阅处理
 *
 * @author zwf
 */
@Component
@Slf4j
public class ConfigHandler implements MessageHandler {

    @Autowired
    private ConfigService configService;

    @Override
    public void process(String content) throws Exception {
        if (StringUtils.isBlank(content)) {
            return;
        }
        log.info("content:{}",content);
        configService.reload(content);
    }
}
