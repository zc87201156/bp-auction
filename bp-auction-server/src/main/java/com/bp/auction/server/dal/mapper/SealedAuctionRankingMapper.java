package com.bp.auction.server.dal.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.bp.auction.common.dal.entity.SealedAuctionRanking;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * <p>
 * 暗拍场用户最终排名记录表 Mapper 接口
 * </p>
 *
 * @author zc
 * @since 2019-02-18
 */
public interface SealedAuctionRankingMapper extends BaseMapper<SealedAuctionRanking> {

    /**
     * 批量插入
     * @param list 批量排名记录
     */
    void batchInsert(List<SealedAuctionRanking> list);

    /**
     * 查询某个用户某场暗拍的排名记录
     * @param auctionId 拍卖id
     * @param userId 用户id
     * @return
     */
    SealedAuctionRanking getMyRanking(@Param("auctionId") long auctionId, @Param("userId") long userId);

    /**
     * 分页查询某场暗拍的排名列表
     * @param auctionId 拍卖id
     * @param start 查询的起始位置
     * @param length 每页记录条数
     * @return
     */
    List<SealedAuctionRanking> findByPage(@Param("auctionId") long auctionId, @Param("start") int start, @Param("length") int length);

}
