package com.bp.auction.admin.dal.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.bp.auction.common.dal.entity.Goods;

import java.util.List;

/**
 * <p>
 * 商品表 Mapper 接口
 * </p>
 *
 * @author zc
 * @since 2019-02-18
 */
public interface GoodsMapper extends BaseMapper<Goods> {
    /**
     * 获取所有的商品
     *
     * @return
     */
    List<Goods> getAll();
}
