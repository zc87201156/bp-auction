package com.bp.auction.server.service;

import com.bp.auction.common.constants.RedisCacheKey;
import com.bp.auction.common.dal.entity.ViolationUser;
import com.bp.auction.server.dal.mapper.ViolationUserMapper;
import com.bp.core.base.BaseServiceImpl;
import org.springframework.stereotype.Service;

import java.util.Date;

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
     * 是否是违约用户
     *
     * @param vu 违约用户信息
     * @return true-是，false-否
     */
    public boolean isViolationUser(ViolationUser vu) {
        return vu != null && vu.getViolationTime() != null;
    }

    /**
     * 是否是违约用户
     *
     * @param userId 用户id
     * @return true-是，false-否
     */
    public boolean isViolationUser(long userId) {
        ViolationUser vu = getByUserId(userId);
        return isViolationUser(vu);
    }

    /**
     * 清除违约信息
     *
     * @param userId 用户id
     */
    public void clear(long userId) {
        ViolationUser vu = getByUserId(userId);
        if (vu != null) {
            vu.setGoodsName(null);
            vu.setViolationAuctionId(null);
            vu.setViolationTime(null);
            vu.setBailAmount(null);
            save(vu);
        }
    }

    /**
     * 用户违约
     *
     * @param userId        用户id
     * @param violationTime 违约时间
     * @param auctionId     违约拍卖id
     * @param bailAmount    保证金
     * @param goodsName     违约拍卖的商品名称
     */
    public void userViolate(long userId, Date violationTime, long auctionId, long bailAmount,
                            String goodsName) {
        ViolationUser vu = new ViolationUser();
        vu.setUserId(userId);
        vu.setViolationTime(violationTime);
        vu.setViolationAuctionId(auctionId);
        vu.setBailAmount(bailAmount);
        vu.setGoodsName(goodsName);

        int update = baseMapper.updateByUserId(vu);
        //受影响的行数为1，则表示更新成功
        if (update == 1) {
            clearCache(userId);
            return;
        }
        //新增
        vu.setCreateTime(new Date());
        save(vu);

        clearCache(userId);
    }
}
