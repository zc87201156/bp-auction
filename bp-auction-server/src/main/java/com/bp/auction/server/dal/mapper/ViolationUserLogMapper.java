package com.bp.auction.server.dal.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.bp.auction.common.dal.entity.ViolationUserLog;
import org.apache.ibatis.annotations.Param;

import java.util.Date;
import java.util.List;

/**
 * <p>
 * 违约用户记录 Mapper 接口
 * </p>
 *
 * @author zc
 * @since 2019-02-18
 */
public interface ViolationUserLogMapper extends BaseMapper<ViolationUserLog> {

    /**
     * 查询指定拍卖id的违约用户记录
     * @param auctionId 拍卖id
     * @return
     */
    ViolationUserLog getByAuctionId(long auctionId);

    /**
     * 查询已过期未处理的违约用户记录
     * @param now 当前时间
     * @return
     */
    List<ViolationUserLog> findViolationList(Date now);

    /**
     * 以违约用户记录id和更新时间戳为条件更新某个违约用户记录的处理状态，返回更新受影响的行数
     * @param id 违约用户记录id
     * @param updateTime 查询出来的该记录的更新时间戳
     * @param processTime 处理时间
     * @return 返回1表示更新成功，返回0表示更新失败
     */
    int process(@Param("id") long id, @Param("updateTime") Date updateTime, @Param("processTime") Date processTime);
}
