package com.bp.auction.server.dal.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.bp.auction.common.dal.entity.RankAwardConfig;
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
public interface RankAwardConfigMapper extends BaseMapper<RankAwardConfig> {

    List<RankAwardConfig> listByRankType(@Param("rankType") Integer rankType);

}
