package com.bp.auction.common.service;

import com.bp.auction.common.queue.MessagePipeline;
import com.bp.auction.common.queue.message.DelayMessage;
import com.bp.core.cache.CacheKey;
import com.bp.core.utils.type.NumberUtils;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.BoundValueOperations;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.integration.support.MessageBuilder;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.concurrent.TimeUnit;

/**
 * 延迟消息服务
 *
 * @author zwf
 */
@Service
@Slf4j
public class DelayMessageService {

    private static final String MESSAGE_HEADER = "x-delay";

    @Autowired
    private MessagePipeline messagePipeline;

    @Autowired
    private StringRedisTemplate stringRedisTemplate;

    /**
     * 延迟消息计数增1
     * @param delayMessage 延迟消息
     * @return 返回增1后的消息计数
     */
    public long incrMessageCount(DelayMessage delayMessage) {
        String key = delayMessage.getKey();
        BoundValueOperations operations = stringRedisTemplate.boundValueOps(key);
        operations.expire(CacheKey.WEEK_1, TimeUnit.SECONDS);
        return operations.increment(1);
    }

    /**
     * 返回延迟消息的消息计数
     * @param delayMessage 延迟消息
     * @return
     */
    public long getMessageCount(DelayMessage delayMessage) {
        String key = delayMessage.getKey();
        String num = stringRedisTemplate.opsForValue().get(key);
        return NumberUtils.toLong(num);
    }


    /**
     * 发送延迟消息
     *
     * @param message 消息
     * @param date    延迟发送时间
     * @return true-发送成功，false-发送失败(延迟发送时间晚于当前服务器时间)
     */
    public boolean send(DelayMessage message, Date date) {
        long delayMillis = date.getTime() - System.currentTimeMillis();
        return send(message, delayMillis);
    }

    /**
     * 发送延迟消息
     *
     * @param message     消息
     * @param delayMillis 延迟毫秒数
     * @return true-发送成功，false-发送失败(延迟毫秒数小于等于0)
     */
    public boolean send(DelayMessage message, long delayMillis) {
        if (delayMillis <= 0L) {
            log.error("send delay message failed, illegal delayMillis:{}. delayMessage:[{}]", delayMillis, message);
            return false;
        }
        //普通延迟消息计数此时为null，需生成该延迟消息计数。拍卖用户出价的延迟消息计数由lua脚本生成，此时不为null。
        if (message.getCount() == null) {
            message.setCount(incrMessageCount(message));
        }
        messagePipeline.outputMessage().send(MessageBuilder.withPayload(message).setHeader(MESSAGE_HEADER, delayMillis).build());
        log.info("send delay message successfully. delayMessage:[{}]", message);
        return true;
    }
}
