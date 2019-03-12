package com.bp.auction.server.dal.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.bp.auction.common.dal.entity.AuctionHistory;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * <p>
 * 拍卖记录表 Mapper 接口
 * </p>
 *
 * @author zc
 * @since 2019-02-18
 */
public interface AuctionHistoryMapper extends BaseMapper<AuctionHistory> {

    /**
     * 获取某一期拍卖的拍卖记录
     * @param auctionId 拍卖id
     * @param num 查询返回的最大数量
     * @return
     */
    List<AuctionHistory> getByAuctionId(@Param("auctionId") long auctionId, @Param("num") int num);
}
