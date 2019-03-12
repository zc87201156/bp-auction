package com.bp.auction.common.queue;

import org.springframework.cloud.stream.annotation.Input;
import org.springframework.cloud.stream.annotation.Output;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.SubscribableChannel;

/**
 * 类名称：MessagePipeline
 * 类描述：定义消息管道的输入输出
 * 开发人：朱水平【Tank】
 * 创建时间：2019/1/15.14:45
 * 修改备注：
 *
 * @author Tank
 * @version 1.0.0
 */
public interface MessagePipeline {

    String OUTPUT = "bid-topic-output";

    String INPUT = "bid-topic-input";

    /**
     * 消息输出
     * @return
     */
    @Output(OUTPUT)
    MessageChannel outputMessage();

    /**
     * 消息输入
     * @return
     */
    @Input(INPUT)
    SubscribableChannel inputMessage();
}
