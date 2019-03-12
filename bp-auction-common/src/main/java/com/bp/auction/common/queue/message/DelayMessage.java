package com.bp.auction.common.queue.message;

import lombok.Data;

/**
 * 延迟消息
 *
 * @author zwf
 */
@Data
public class DelayMessage {

    /***
     * 消息类型
     */
    private DelayMessageType type;

    /***
     * 场次ID
     */
    private Long auctionId;

    /**
     * 用户ID
     */
    private Long userId;

    /***
     * 拓展业务值
     */
    private Object data;

    /***
     * 存入redis计数的key
     */
    private String key;

    /***
     * 消息计数
     */
    private Long count;


    public DelayMessage() {

    }

    public DelayMessage(DelayMessageType type, Long auctionId) {
        this(type, auctionId, null);
    }

    public DelayMessage(DelayMessageType type, Long auctionId, Long userId) {
        this(type, auctionId, userId, null, null);
    }

    public DelayMessage(DelayMessageType type, Long auctionId, Long userId, Object data, Long count) {
        if (type == null) {
            throw new NullPointerException("type is null");
        }
        this.type = type;
        this.auctionId = auctionId;
        this.userId = userId;
        this.data = data;
        this.key = type.key(auctionId, userId);
        this.count = count;
    }

    @Override
    public String toString() {
        return  "type:" + type + ",auctionId:" + auctionId + ",userId:" + userId + ",data:" + data + ",key:" + key + ",count:" + count;
    }
}
