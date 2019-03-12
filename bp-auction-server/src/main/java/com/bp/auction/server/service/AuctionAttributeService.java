package com.bp.auction.server.service;

import com.bp.auction.common.constants.Attribute;
import com.bp.auction.common.constants.AuctionStatus;
import com.bp.auction.common.constants.RedisCacheKey;
import com.bp.auction.common.dal.entity.AuctionAttribute;
import com.bp.auction.server.dal.mapper.AuctionAttributeMapper;
import com.bp.core.base.BaseServiceImpl;
import com.bp.core.cache.CacheKey;
import com.bp.core.utils.type.NumberUtils;
import org.springframework.data.redis.core.BoundSetOperations;
import org.springframework.data.redis.core.BoundValueOperations;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.TimeUnit;

/**
 * <p>
 * 拍卖属性表 服务实现类
 * </p>
 *
 * @author zc
 * @since 2019-02-18
 */
@Service
public class AuctionAttributeService extends BaseServiceImpl<AuctionAttributeMapper, AuctionAttribute> {

    @Override
    protected void clearCache(AuctionAttribute entity) {
        if (entity != null && entity.getAuctionId() != null) {
            clearCache(entity.getAuctionId());
        }
    }

    private void clearCache(long auctionId) {
        redisTemplate.delete(RedisCacheKey.ALL_ATTRIBUTES_FROM_DB_BY_AUCTION_ID.key(auctionId));
    }

    /**
     * 从数据库中获取某个拍卖的所有属性
     *
     * @param auctionId 拍卖id
     * @return
     */
    private Map<Attribute, AuctionAttribute> loadAllAttributesByAuctionId(long auctionId) {
        return cache(RedisCacheKey.ALL_ATTRIBUTES_FROM_DB_BY_AUCTION_ID.key(auctionId),
                () -> {
                    List<AuctionAttribute> list = baseMapper.getAttributesByAuctionId(auctionId);
                    Map<Attribute, AuctionAttribute> result = new HashMap<>();
                    for (AuctionAttribute aa : list) {
                        if (aa != null && aa.getAttribute() != null) {
                            Attribute attribute = Attribute.getByValue(aa.getAttribute());
                            if (attribute != null) {
                                result.put(attribute, aa);
                            }
                        }
                    }
                    return result;
                }, CacheKey.HOUR_1);
    }

    /**
     * 批量保存拍卖属性
     * @param auctionId 拍卖id
     * @param auctionAttributes 拍卖属性集合
     */
    public void batchSaveAuctionAttributes(long auctionId, List<AuctionAttribute> auctionAttributes) {
        List<AuctionAttribute> newList = new LinkedList<>();
        for (AuctionAttribute a : auctionAttributes) {
            int value = baseMapper.updateAttributeValue(a.getAuctionId(), a.getAttribute(), a.getValue());
            //数据库受影响的行数为1，则表明更新成功
            if (value == 1) {
                continue;
            }
            //如果不存在则新增
            AuctionAttribute aa = new AuctionAttribute();
            aa.setId(nextId(AuctionAttribute.class));
            aa.setAuctionId(a.getAuctionId());
            aa.setAttribute(a.getAttribute());
            aa.setType(a.getType());
            aa.setValue(a.getValue());
            aa.setCreateTime(new Date());

            newList.add(aa);
        }
        //批量保存
        saveBatch(newList);
        //清除缓存
        clearCache(auctionId);
    }

    /**
     * 获取某场拍卖的围观人次
     *
     * @param auctionId 拍卖id
     * @param status    拍卖状态
     * @return
     */
    public int getOnlookerCount(long auctionId, AuctionStatus status) {
        //如果拍卖未结束则从缓存中获取围观人次
        if (status == AuctionStatus.NO_AUCTION || status == AuctionStatus.AUCTIONING) {
            Integer num = (Integer) redisTemplate.opsForValue().get(RedisCacheKey.ONLOOKER_COUNT.key(auctionId));
            return num == null ? 0 : num;
        }
        //如果拍卖已结束则从数据库中获取围观人次
        Integer num = getAttributeValueFromDB(auctionId, Attribute.ONLOOKER_COUNT);
        return num == null ? 0 : num;
    }

    /**
     * 获取某场拍卖已出价的人数
     *
     * @param auctionId 拍卖id
     * @param status    拍卖状态
     * @return
     */
    public int getAuctionedUserCount(long auctionId, AuctionStatus status) {
        //如果拍卖未结束则从缓存中获取出价人数
        if (status == AuctionStatus.NO_AUCTION || status == AuctionStatus.AUCTIONING) {
            return redisTemplate.opsForSet().size(RedisCacheKey.AUCTIONED_USER_ID.key(auctionId)).intValue();
        }
        //如果拍卖已结束则从数据库中获取出价人数
        Integer num = getAttributeValueFromDB(auctionId, Attribute.AUCTION_USER_COUNT);
        return num == null ? 0 : num;
    }

    /**
     * 从数据库中获取某场拍卖的某个属性
     *
     * @param auctionId 拍卖id
     * @param attribute 属性
     * @param <T>
     * @return
     */
    public <T> T getAttributeValueFromDB(long auctionId, Attribute attribute) {
        if (attribute == null) {
            return null;
        }
        Map<Attribute, AuctionAttribute> allAuctionAttributes = loadAllAttributesByAuctionId(auctionId);
        AuctionAttribute value = allAuctionAttributes.get(attribute);
        if (value == null) {
            return null;
        }

        switch (attribute.getType()) {
            case INTEGER:
                return (T) Integer.valueOf(NumberUtils.toInt(value.getValue()));
            case LONG:
                return (T) Long.valueOf(NumberUtils.toInt(value.getValue()));
            case DOUBLE:
                return (T) Double.valueOf(NumberUtils.toDouble(value.getValue()));
            case FLOAT:
                return (T) Float.valueOf(NumberUtils.toFloat(value.getValue()));
            case STRING:
            default:
                return (T) value.getValue();
        }
    }

    /**
     * 添加某场拍卖已出价人
     *
     * @param auctionId 拍卖id
     * @param userId    用户id
     * @return true-出价人数有变化，false-出价人数无变化
     */
    public boolean addAuctionedUser(long auctionId, long userId) {
        BoundSetOperations operations = redisTemplate.boundSetOps(RedisCacheKey.AUCTIONED_USER_ID.key(auctionId));
        operations.expire(CacheKey.MINUTE_5, TimeUnit.SECONDS);
        long newCount = operations.add(userId);
        return newCount > 0L;
    }

    /**
     * 某场拍卖围观人次+1
     * @param auctionId 拍卖id
     * @return
     */
    public int incrByOnlookerCount(long auctionId) {
        BoundValueOperations bvo = redisTemplate.boundValueOps(RedisCacheKey.ONLOOKER_COUNT.key(auctionId));
        int count = bvo.increment(1L).intValue();
        bvo.expire(CacheKey.DAY_1, TimeUnit.SECONDS);
        return count;
    }

}
