package com.bp.auction.server.dal.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.bp.auction.common.dal.entity.Beginner;
import org.apache.ibatis.annotations.Param;

import java.util.Date;

/**
 * <p>
 * 新手表 Mapper 接口
 * </p>
 *
 * @author zc
 * @since 2019-02-18
 */
public interface BeginnerMapper extends BaseMapper<Beginner> {

    /**
     * 查询某个用户的新手信息
     *
     * @param userId 用户id
     * @return
     */
    Beginner getByUserId(@Param("userId") long userId);

    /**
     * 更新用户的首次出价时间
     *
     * @param userId           用户id
     * @param firstAuctionTime 首次出价时间
     */
    void updateFirstAuctionTime(@Param("userId") long userId, @Param("firstAuctionTime") Date firstAuctionTime);

    /**
     * 用户拍中,更新用户的上次拍中时间及拍中总次数
     *
     * @param userId             用户id
     * @param auctionSuccessDate 拍中时间
     */
    void auctionSuccess(@Param("userId") long userId, @Param("auctionSuccessDate") Date auctionSuccessDate);
}
