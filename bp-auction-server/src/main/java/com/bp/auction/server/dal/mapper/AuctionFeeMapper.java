package com.bp.auction.server.dal.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.bp.auction.common.dal.entity.AuctionFee;

import java.util.List;

/**
 * <p>
 * 拍卖手续费配置表 Mapper 接口
 * </p>
 *
 * @author zc
 * @since 2019-02-18
 */
public interface AuctionFeeMapper extends BaseMapper<AuctionFee> {
    /**
     * 获取所有启用的拍卖手续费配置
     *
     * @return
     */
    List<AuctionFee> getAll();
}
