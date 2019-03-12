package com.bp.auction.server.dal.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.bp.auction.common.dal.entity.AuctionUser;
import com.bp.auction.server.service.bo.AuctionUserInfo;
import org.apache.ibatis.annotations.Param;

import java.util.Date;
import java.util.List;

/**
 * <p>
 * 用户的竞拍 Mapper 接口
 * </p>
 *
 * @author zc
 * @since 2019-02-18
 */
public interface AuctionUserMapper extends BaseMapper<AuctionUser> {

    /**
     * 查询某个用户正在拍卖的拍卖活动
     * @param userId 用户id
     * @param num 查询结果返回前num条记录
     * @return
     */
    List<AuctionUser> findAuctioningByUserId(@Param("userId") long userId, @Param("num") int num);

    /**
     * 查询某个用户拍中的拍卖活动
     * @param userId 用户id
     * @param num 查询结果返回前num条记录
     * @return
     */
    List<AuctionUserInfo> findSuccessAuctionByUserId(@Param("userId") long userId, @Param("num") int num);

    /**
     * 查询某个用户未拍中的拍卖活动
     * @param userId 用户id
     * @param num 查询结果返回前num条记录
     * @return
     */
    List<AuctionUser> findFailedAuctionByUserId(@Param("userId") long userId, @Param("num") int num);

    /**
     * 更新所有用户某个拍卖的拍卖成交人id
     * @param winnerUserId 拍卖成交人id
     * @param auctionId 拍卖id
     */
    void updateWinnerUserIdByAuctionId(@Param("winnerUserId") long winnerUserId, @Param("auctionId") long auctionId);

    /**
     * 更新某个用户我的竞拍信息。
     * @param auctionFee 拍卖手续费
     * @param auctionTime 出价时间
     * @param userId 用户id
     * @param auctionId 拍卖id
     * @return 返回数据库受影响的行数。返回1则表示更新成功
     */
    int updateAuctionUser(@Param("auctionFee") long auctionFee, @Param("auctionTime") Date auctionTime,
                          @Param("userId") long userId, @Param("auctionId") long auctionId);

    /**
     * 插入一条某个用户我的竞拍信息
     * @param auctionUser 用户竞拍信息
     * @return 返回数据库受影响的行数。返回1则表示插入成功
     */
    int insertAuctionUser(AuctionUser auctionUser);

}
