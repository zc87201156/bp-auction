package com.bp.auction.server.dal.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.bp.auction.common.dal.entity.Config;
import org.apache.ibatis.annotations.Param;

/***
 * 系统配置项
 */
public interface ConfigMapper extends BaseMapper<Config> {
    /***
     * 根据配置项名称查询配置项
     * @param name
     * @return
     */
    Config findByName(@Param("name") String name);
}
