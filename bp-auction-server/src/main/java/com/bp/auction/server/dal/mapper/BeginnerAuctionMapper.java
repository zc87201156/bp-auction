package com.bp.auction.server.dal.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.bp.auction.common.dal.entity.BeginnerAuction;

/**
 * <p>
 * 新手引导专用拍卖 Mapper 接口
 * </p>
 *
 * @author zc
 * @since 2019-02-18
 */
public interface BeginnerAuctionMapper extends BaseMapper<BeginnerAuction> {
    /**
     * 获取某个用户的新手拍卖记录
     * @param userId 用户id
     * @return
     */
    BeginnerAuction getByUserId(long userId);
}
