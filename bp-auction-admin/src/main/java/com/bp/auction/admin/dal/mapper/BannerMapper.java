package com.bp.auction.admin.dal.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.bp.auction.common.dal.entity.Banner;

import java.util.List;

/**
 * <p>
 * banner图 Mapper 接口
 * </p>
 *
 * @author zc
 * @since 2019-02-18
 */
public interface BannerMapper extends BaseMapper<Banner> {

    List<Banner> listBanners();
}
