package com.bp.auction.server.redis;

import com.alibaba.fastjson.support.spring.FastJsonRedisSerializer;
import com.bp.auction.common.constants.RedisCacheKey;
import com.bp.auction.common.queue.message.DelayMessageType;
import com.bp.core.cache.CustomFastJsonRedisSerializer;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.script.DefaultRedisScript;
import org.springframework.data.redis.serializer.StringRedisSerializer;
import org.springframework.scripting.support.ResourceScriptSource;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.util.ArrayList;
import java.util.List;

/**
 * 类名称：RedisLuaScriptService
 * 类描述：利用lua脚本来解决并发时数据不准确问题
 * 开发人：朱水平【Tank】
 * 创建时间：2019/1/8.10:17
 * 修改备注：
 *
 * @version 1.0.0
 */
@Service
@Slf4j
public class RedisLuaScriptService {

    @Autowired
    private RedisTemplate template;
    //用户出价脚本
    private DefaultRedisScript<Object> auctionScript;
    //拍卖结束脚本
    private DefaultRedisScript<Object> endAuctionScript;

    //用户出价脚本位置
    private final static String AUCTION_SCRIPT_PATH = "lua/auction.lua";
    //是否结束脚本位置
    private final static String END_AUCTION_SCRIPT_PATH = "lua/endAuction.lua";

    private static final String BLANK = "";

    /**
     * 用户出价
     *
     * @param auctionId     拍卖id
     * @param userId        用户id
     * @param countdownTime 拍卖倒计时时长(毫秒)
     * @return 返回集合中第一个元素存放状态（状态码参考ErrorCode类），如出价成功则将拍卖信息放入第二个元素中,延迟消息计数值放第三个元素
     */
    public List auction(long auctionId, long userId, long countdownTime) {
        long start = System.currentTimeMillis();
        List<String> keyList = new ArrayList<>(4);
        keyList.add(RedisCacheKey.AUCTION_INFO_BY_ID.key(auctionId));
        keyList.add(userId + BLANK);
        keyList.add(countdownTime + BLANK);
        keyList.add(DelayMessageType.END_AUCTION.key(auctionId));
        //执行脚本
        List result = (List) template.execute(auctionScript, new StringRedisSerializer(), new FastJsonRedisSerializer(Object.class), keyList);
        log.info("lua脚本执行耗时:{}", System.currentTimeMillis() - start);
        return result;
    }

    /**
     * 拍卖结束
     *
     * @param auctionId        拍卖id
     * @param delayPaymentTime 如拍卖成交则允许延迟支付的毫秒数
     * @param count            累计出价次数
     * @return 返回集合中第一个元素存放状态（-2:拍卖信息缓存不存在，-1:延迟消息已无效，0：非进行中的拍卖，1：结束拍卖成功），
     * 如拍卖结束成功则将拍卖信息放入第二个元素中
     */
    public List endAuction(long auctionId, long delayPaymentTime, long count) {
        List<String> keyList = new ArrayList<>(4);
        keyList.add(RedisCacheKey.AUCTION_INFO_BY_ID.key(auctionId));
        keyList.add(delayPaymentTime + BLANK);
        keyList.add(DelayMessageType.END_AUCTION.key(auctionId));
        keyList.add(count + BLANK);
        return (List) template.execute(endAuctionScript, new StringRedisSerializer(), new CustomFastJsonRedisSerializer(Object.class), keyList);
    }

    @PostConstruct
    public void init() {
        //拍卖出价
        auctionScript = new DefaultRedisScript<>();
        auctionScript.setResultType(Object.class);
        auctionScript.setScriptSource(new ResourceScriptSource(new ClassPathResource(AUCTION_SCRIPT_PATH)));

        //拍卖结束
        endAuctionScript = new DefaultRedisScript<>();
        endAuctionScript.setResultType(Object.class);
        endAuctionScript.setScriptSource(new ResourceScriptSource(new ClassPathResource(END_AUCTION_SCRIPT_PATH)));
    }
}
