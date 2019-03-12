package com.bp.auction.server.queue;

import com.bp.auction.common.queue.MessagePipeline;
import com.bp.auction.common.queue.message.DelayMessage;
import com.bp.auction.common.service.DelayMessageService;
import com.bp.auction.server.queue.message.DelayMessageHandler;
import com.bp.auction.server.queue.message.DelayMessageHandlerFactory;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang.exception.ExceptionUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.stream.annotation.StreamListener;
import org.springframework.stereotype.Component;

/**
 * 类名称：MessageQueueListener
 * 类描述：延迟任务监听执行
 * 开发人：朱水平【Tank】
 * 创建时间：2019/1/15.15:11
 * 修改备注：
 *
 * @author Tank
 * @version 1.0.0
 */
@Slf4j
@Component
public class DelayMessageQueueListener {

    @Autowired
    private DelayMessageHandlerFactory factory;

    @Autowired
    private DelayMessageService delayMessageService;

    @StreamListener(MessagePipeline.INPUT)
    public void receive(DelayMessage message) {
        log.info("receive message:[{}]", message);
        try {
            if (!validateMessage(message)) {
                return;
            }
            DelayMessageHandler handler = factory.getHandler(message.getType());
            handler.process(message);
        } catch (Exception e) {
            log.error("process delay message error, delayMessage:[{}], ex:{}", message, ExceptionUtils.getStackTrace(e));
        }
    }

    /***
     * 验证延迟消息是否有效
     * @param message 延迟消息
     * @return true-延迟消息有效，false-延迟消息失效
     */
    private boolean validateMessage(DelayMessage message) {
        long count = delayMessageService.getMessageCount(message);
        return count == message.getCount();
    }

}
