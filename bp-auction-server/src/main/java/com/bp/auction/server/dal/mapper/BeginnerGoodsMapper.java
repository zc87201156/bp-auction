package com.bp.auction.server.dal.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.bp.auction.common.dal.entity.BeginnerGoods;

import java.util.List;

/**
 * <p>
 * 新手引导专用商品 Mapper 接口
 * </p>
 *
 * @author zc
 * @since 2019-02-20
 */
public interface BeginnerGoodsMapper extends BaseMapper<BeginnerGoods> {

    /**
     * 获取所有新手商品
     * @return
     */
    List<BeginnerGoods> getAll();
}
