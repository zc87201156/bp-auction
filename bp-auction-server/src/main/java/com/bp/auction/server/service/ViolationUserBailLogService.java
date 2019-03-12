package com.bp.auction.server.service;

import com.bp.auction.common.dal.entity.ViolationUserBailLog;
import com.bp.auction.server.dal.mapper.ViolationUserBailLogMapper;
import com.bp.core.base.BaseServiceImpl;
import org.springframework.stereotype.Service;

import java.util.Date;

/**
 * <p>
 * 违约用户交付保证金记录表 服务实现类
 * </p>
 *
 * @author zc
 * @since 2019-02-18
 */
@Service
public class ViolationUserBailLogService extends BaseServiceImpl<ViolationUserBailLogMapper, ViolationUserBailLog> {

    /**
     * 插入一条保证金交付记录
     * @param log 保证金交付记录
     */
    public void insert(ViolationUserBailLog log) {
        log.setCreateTime(new Date());
        save(log);
    }
}
