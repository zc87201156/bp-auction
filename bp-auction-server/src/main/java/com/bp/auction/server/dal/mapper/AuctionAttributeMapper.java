package com.bp.auction.server.dal.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.bp.auction.common.dal.entity.AuctionAttribute;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * <p>
 * 拍卖属性表 Mapper 接口
 * </p>
 *
 * @author zc
 * @since 2019-02-18
 */
public interface AuctionAttributeMapper extends BaseMapper<AuctionAttribute> {

    /**
     * 获取某个拍卖的属性列表
     * @param auctionId 拍卖id
     * @return
     */
    List<AuctionAttribute> getAttributesByAuctionId(long auctionId);

    /**
     * 更新某个拍卖属性的值
     * @param auctionId 拍卖id
     * @param attribute 属性
     * @param value 属性值
     * @return 返回数据库受影响的行数，返回1表示更新成功，返回0表示更新失败
     */
    int updateAttributeValue(@Param("auctionId") long auctionId, @Param("attribute") int attribute, @Param("value") String value);

    /**
     * 批量保存拍卖属性
     * @param list 多个拍卖属性
     */
    void batchInsert(List<AuctionAttribute> list);
}
