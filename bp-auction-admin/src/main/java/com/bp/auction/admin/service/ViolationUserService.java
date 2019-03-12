package com.bp.auction.admin.service;

import com.bp.auction.admin.dal.mapper.ViolationUserMapper;
import com.bp.auction.common.constants.RedisCacheKey;
import com.bp.auction.common.dal.entity.ViolationUser;
import com.bp.core.base.BaseServiceImpl;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

/**
 * <p>
 * 违约用户表 服务实现类
 * </p>
 *
 * @author zc
 * @since 2019-02-18
 */
@Service
public class ViolationUserService extends BaseServiceImpl<ViolationUserMapper, ViolationUser> {

    @Override
    protected void clearCache(ViolationUser entity) {
        if (entity != null && entity.getUserId() != null) {
            clearCache(entity.getUserId());
        }
    }

    private void clearCache(long userId) {
        redisTemplate.delete(RedisCacheKey.VIOLATION_USER.key(userId));
    }

    /**
     * 查询某个违约用户
     *
     * @param userId 用户id
     * @return
     */
    public ViolationUser getByUserId(long userId) {
        return cache(RedisCacheKey.VIOLATION_USER.key(userId), () -> baseMapper.getByUserId(userId));
    }
    /**
     * 清除违约信息
     *
     * @param userId 用户id
     * @param operator 操作人
     */
    public void clear(long userId,String operator) {
        ViolationUser vu = getByUserId(userId);
        if (vu != null) {
            vu.setGoodsName(null);
            vu.setViolationAuctionId(null);
            vu.setViolationTime(null);
            vu.setBailAmount(null);
            vu.setOperator(operator);
            save(vu);
        }
    }

   public List<ViolationUser> listViolationUser(Long userId){
        return baseMapper.listViolationUser(userId);
    }
}
