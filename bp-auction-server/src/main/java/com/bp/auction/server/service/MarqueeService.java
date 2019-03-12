package com.bp.auction.server.service;

import com.bp.auction.common.constants.RedisCacheKey;
import com.bp.auction.server.service.bo.MarqueeInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.BoundListOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;

/**
 * 跑马灯服务
 *
 * @author zwf
 */
@Service
public class MarqueeService {

    @Autowired
    private ConfigService configService;

    @Autowired
    private RedisTemplate redisTemplate;

    @Autowired
    private WebSocketService webSocketService;

    /**
     * 添加跑马灯信息
     *
     * @param nickname  昵称
     * @param goodsName 商品名称
     * @param price     成交价格
     */
    @Async
    public void add(String nickname, String goodsName, BigDecimal price) {
        int max = configService.getMarqueeNum();
        if (max < 0) {
            max = 10;//默认10个
        }
        max--;//redis数量从0开始计算

        MarqueeInfo info = new MarqueeInfo(nickname, goodsName, price);
        BoundListOperations blo = redisTemplate.boundListOps(RedisCacheKey.MARQUEE.key());
        blo.leftPush(info);
        //只保留前N条跑马灯
        blo.trim(0, max);
        //全服推送跑马灯信息
        webSocketService.sendMarqueeMessage(nickname, goodsName, price);
    }

    /**
     * 返回跑马灯列表
     *
     * @return
     */
    public List<MarqueeInfo> getMarquee() {
        return redisTemplate.boundListOps(RedisCacheKey.MARQUEE.key()).range(0, -1);
    }
}
