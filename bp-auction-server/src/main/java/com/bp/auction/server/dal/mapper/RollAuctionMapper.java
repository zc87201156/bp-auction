package com.bp.auction.server.dal.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.bp.auction.common.dal.entity.RollAuction;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * <p>
 *  Mapper 接口
 * </p>
 *
 * @author zc
 * @since 2019-02-18
 */
public interface RollAuctionMapper extends BaseMapper<RollAuction> {

    List<RollAuction> listRollAuctions(@Param("environment") int environment);

    long countByCategoryId(@Param("categoryId") Long categoryId, @Param("environment") int environment);
}
