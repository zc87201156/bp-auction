package com.bp.auction.admin.dal.mapper;


import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.bp.auction.common.dal.entity.Auction;
import org.apache.ibatis.annotations.Param;

import java.util.Date;
import java.util.List;

/**
 * <p>
 * 拍卖表 Mapper 接口
 * </p>
 *
 * @author zc
 * @since 2019-02-18
 */
public interface AuctionMapper extends BaseMapper<Auction> {

    /**
     * 查询某商品最近几期的拍卖
     *
     * @param goodsId       商品id
     * @param auctionStatus 拍卖状态
     * @param top           最近几期
     * @return 返回最近top期拍卖
     */
    List<Auction> findLastAuctions(@Param("goodsId") long goodsId, @Param("auctionStatus") int auctionStatus, @Param("top") int top);

    /**
     * 查询大厅某场次类型的拍卖id列表
     *
     * @param environment  环境
     * @param auctionClass 场次类型
     * @return
     */
    List<Long> findIdListInHall(@Param("environment") int environment, @Param("auctionClass") int auctionClass);

    /***
     *
     * @param rollAuctionId
     * @return
     */
    List<Auction> getNoStartAuctions(@Param("rollAuctionId") Long rollAuctionId);

    /***
     * 获取某人赢得的未支付且未过期拍卖商品数量
     * @param userId
     * @return
     */
    long getUserWinAuctionNum(@Param("userId") Long userId, @Param("currentTime") Date currentTime);

    /**
     * 获取某个环境下已启用未结束的拍卖数量
     *
     * @param environment 环境
     * @return
     */
    long getNoCompleteAuctionsNum(@Param("environment") int environment);
}
