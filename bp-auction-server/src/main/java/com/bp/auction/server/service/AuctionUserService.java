package com.bp.auction.server.service;

import com.bp.auction.common.constants.YesOrNo;
import com.bp.auction.common.dal.entity.AuctionUser;
import com.bp.auction.server.controller.response.AuctionInfoRsp;
import com.bp.auction.server.controller.response.MyAuctionInfoRsp;
import com.bp.auction.server.dal.mapper.AuctionUserMapper;
import com.bp.auction.server.service.bo.AuctionInfo;
import com.bp.auction.server.service.bo.AuctionUserInfo;
import com.bp.core.base.BaseServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

/**
 * <p>
 * 用户的竞拍 服务实现类
 * </p>
 *
 * @author zc
 * @since 2019-02-18
 */
@Service
public class AuctionUserService extends BaseServiceImpl<AuctionUserMapper, AuctionUser> {

    @Autowired
    private ConfigService configService;

    @Autowired
    private AuctionService auctionService;

    @Autowired
    private DepositService depositService;

    /**
     * 查询某个用户正在拍的拍卖列表
     *
     * @param userId 用户id
     * @return
     */
    public List<MyAuctionInfoRsp> findAuctioningInfoByUserId(long userId) {
        int num = configService.getMyAuctionNum();
        List<AuctionUser> list = baseMapper.findAuctioningByUserId(userId, num);
        List<MyAuctionInfoRsp> myList = convert(list);
        List<Long> depositIds = depositService.getUserDepositRecord(userId);
        for (MyAuctionInfoRsp myAuctionInfoRsp : myList) {
            if (depositIds != null && depositIds.contains(myAuctionInfoRsp.getAuctionInfo().getAuctionId())) {
                myAuctionInfoRsp.setIsDeposit(YesOrNo.YES.getValue());
            } else {
                myAuctionInfoRsp.setIsDeposit(YesOrNo.NO.getValue());
            }
        }
        return myList;
    }

    /**
     * 查询某个用户拍中的拍卖列表
     *
     * @param userId 用户id
     * @return
     */
    public List<MyAuctionInfoRsp> findSuccessAuctionInfoByUserId(long userId) {
        int num = configService.getMyAuctionNum();
        List<AuctionUserInfo> list = baseMapper.findSuccessAuctionByUserId(userId, num);

        List<MyAuctionInfoRsp> result = new ArrayList<>(list.size());
        for (AuctionUserInfo au : list) {
            MyAuctionInfoRsp myInfo = new MyAuctionInfoRsp();
            //普通拍卖
            if (au.getKind() == 0) {
                AuctionInfo auctionInfo = auctionService.getAuctionInfoById(au.getAuctionId());
                if (auctionInfo != null) {
                    myInfo.setAuctionInfo(new AuctionInfoRsp(auctionInfo));
                    myInfo.setAuctionTimes(au.getAuctionTimes());
                    myInfo.setLastAuctionTime(au.getLastAuctionTime());

                    result.add(myInfo);
                }
            } else {
                //新手拍卖
                myInfo.setAuctionInfo(new AuctionInfoRsp(au));
                myInfo.setAuctionTimes(au.getAuctionTimes());
                myInfo.setLastAuctionTime(au.getLastAuctionTime());

                result.add(myInfo);
            }
        }

        return result;
    }

    /**
     * 查询某个用户未拍中的拍卖列表
     *
     * @param userId 用户id
     * @return
     */
    public List<MyAuctionInfoRsp> findFailedAuctionInfoByUserId(long userId) {
        int num = configService.getMyAuctionNum();
        List<AuctionUser> list = baseMapper.findFailedAuctionByUserId(userId, num);
        return convert(list);
    }

    private List<MyAuctionInfoRsp> convert(List<AuctionUser> auctionUsers) {
        List<MyAuctionInfoRsp> result = new ArrayList<>(auctionUsers.size());
        for (AuctionUser au : auctionUsers) {
            AuctionInfo auctionInfo = auctionService.getAuctionInfoById(au.getAuctionId());
            if (auctionInfo != null) {
                MyAuctionInfoRsp myInfo = new MyAuctionInfoRsp();
                myInfo.setAuctionInfo(new AuctionInfoRsp(auctionInfo));
                myInfo.setAuctionTimes(au.getAuctionTimes());
                myInfo.setFirstAuctionTime(au.getFirstAuctionTime());
                myInfo.setLastAuctionTime(au.getLastAuctionTime());

                result.add(myInfo);
            }
        }
        return result;
    }

    /**
     * 更新某个拍卖的用户的拍卖成交人id
     *
     * @param winnerUserId 成交人id
     * @param auctionId    拍卖id
     */
    public void updateWinnerUserIdByAuctionId(long winnerUserId, long auctionId) {
        baseMapper.updateWinnerUserIdByAuctionId(winnerUserId, auctionId);
    }

    /**
     * 更新用户的我的竞拍信息. 如竞拍信息不存在则会添加。
     *
     * @param userId      用户id
     * @param auctionId   拍卖id
     * @param auctionFee  拍卖手续费
     * @param auctionTime 拍卖时间
     */
    public void updateAuctionUser(long userId, long auctionId, long auctionFee, Date auctionTime) {
        int value = baseMapper.updateAuctionUser(auctionFee, auctionTime, userId, auctionId);
        //数据库受影响的行数为1，则表明更新成功
        if (value == 1) {
            return;
        }
        //如果该用户我的竞拍信息不存在则添加
        AuctionUser au = new AuctionUser();
        au.setUserId(userId);
        au.setAuctionId(auctionId);
        au.setAuctionTimes(1);
        au.setTotalAuctionFee(auctionFee);
        au.setFirstAuctionTime(auctionTime);
        au.setLastAuctionTime(auctionTime);
        au.setCreateTime(new Date());
        save(au);
    }
}
