package com.bp.auction.admin.dal.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.bp.auction.common.dal.entity.ViolationUser;
import org.apache.ibatis.annotations.Param;

import java.util.List;

/**
 * <p>
 * 违约用户表 Mapper 接口
 * </p>
 *
 * @author zc
 * @since 2019-02-18
 */
public interface ViolationUserMapper extends BaseMapper<ViolationUser> {

    /**
     * 查询指定的违约用户
     * @param userId 用户id
     * @return
     */
    ViolationUser getByUserId(long userId);

    /***
     * 查询违约用户列表
     * @param userId
     * @return
     */
    List<ViolationUser> listViolationUser(@Param("userId") Long userId);
}
