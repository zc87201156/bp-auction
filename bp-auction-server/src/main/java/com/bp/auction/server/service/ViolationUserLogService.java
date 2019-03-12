package com.bp.auction.server.service;

import com.bp.auction.common.constants.PaymentStatus;
import com.bp.auction.common.constants.YesOrNo;
import com.bp.auction.common.dal.entity.ViolationUserLog;
import com.bp.auction.server.dal.mapper.ViolationUserLogMapper;
import com.bp.auction.server.service.bo.AuctionInfo;
import com.bp.core.base.BaseServiceImpl;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

/**
 * <p>
 * 违约用户记录 服务实现类
 * </p>
 *
 * @author zc
 * @since 2019-02-18
 */
@Service
public class ViolationUserLogService extends BaseServiceImpl<ViolationUserLogMapper, ViolationUserLog> {

    /**
     * 某条违约用户记录完成支付
     *
     * @param auctionId   拍卖id
     * @param paymentTime 支付时间
     */
    public void completePayment(long auctionId, Date paymentTime) {
        ViolationUserLog log = baseMapper.getByAuctionId(auctionId);
        if (log != null) {
            log.setPaymentStatus(PaymentStatus.SUCCESS.getValue());
            log.setPaymentTime(paymentTime);
            log.setProcessed(YesOrNo.YES.getValue());
            //log.setProcessTime(new Date());
            save(log);
        }
    }

    /**
     * 查询已过期未处理的违约用户记录
     *
     * @return
     */
    public List<ViolationUserLog> findViolationList() {
        return baseMapper.findViolationList(new Date());
    }

    /**
     * 以违约用户记录id和更新时间戳为条件更新某个违约用户记录的状态
     *
     * @param log 违约用户记录
     * @return true-更新成功, false-更新失败(记录被支付回调修改过了)
     */
    public boolean process(ViolationUserLog log) {
        if (log == null) {
            return false;
        }
        int update = baseMapper.process(log.getId(), log.getUpdateTime(), new Date());
        return update == 1;
    }

    /**
     * 添加用户违约用户记录
     *
     * @param auctionInfo 拍卖信息
     */
    public void addViolationUserLog(AuctionInfo auctionInfo) {
        ViolationUserLog log = new ViolationUserLog();
        log.setAuctionId(auctionInfo.getId());
        log.setUserId(auctionInfo.getCurrentUserId());
        log.setStartTime(auctionInfo.getStartTime());
        log.setGoodsName(auctionInfo.getGoodsName());
        log.setPaymentEndTime(auctionInfo.getPaymentEndTime());
        log.setPaymentStatus(auctionInfo.getPaymentStatus().getValue());
        log.setProcessed(YesOrNo.NO.getValue());
        save(log);
    }
}
