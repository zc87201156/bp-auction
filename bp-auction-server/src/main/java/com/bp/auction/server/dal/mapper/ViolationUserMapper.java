package com.bp.auction.server.dal.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.bp.auction.common.dal.entity.ViolationUser;
import org.apache.ibatis.annotations.Param;

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
    ViolationUser getByUserId(@Param("userId") long userId);

    /**
     * 更新某个用户的违约信息，返回受影响的行数
     * @param vu 违约用户信息
     * @return 返回1表示更新成功，返回0表示更新失败(记录不存在)
     */
    int updateByUserId(ViolationUser vu);
}
