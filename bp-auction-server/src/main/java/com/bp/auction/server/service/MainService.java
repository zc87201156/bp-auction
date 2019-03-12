package com.bp.auction.server.service;

import com.bp.auction.common.constants.Attribute;
import com.bp.auction.common.constants.AuctionClass;
import com.bp.auction.common.constants.AuctionStatus;
import com.bp.auction.common.constants.AuctionType;
import com.bp.auction.common.dal.entity.AuctionAttribute;
import com.bp.auction.common.dal.entity.RollAuction;
import com.bp.auction.server.service.bo.AuctionInfo;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.LinkedList;
import java.util.List;

/**
 * 拍卖核心流程服务
 * @author zwf
 */
@Slf4j
@Service
public class MainService {

	@Autowired
	private AuctionService auctionService;

	@Autowired
	private AuctionUserService auctionUserService;

	@Autowired
	private AuctionAttributeService auctionAttributeService;

	@Autowired
	private BeginnerService beginnerService;

	@Autowired
	private UserService userService;

	@Autowired
	private ViolationUserLogService violationUserLogService;

	@Autowired
	private SealedAuctionService sealedAuctionService;

	@Autowired
	private MarqueeService marqueeService;

	@Autowired
	private WebSocketService webSocketService;

    @Autowired
    private DepositService depositService;

    @Autowired
    private RollAuctionService rollAuctionService;
	/**
	 * 拍卖开始
	 * @param auctionId 拍卖id
	 */
	public void startAuction(long auctionId) {
		AuctionInfo auctionInfo = auctionService.getAuctionInfoById(auctionId);
		if (auctionInfo == null) {
			log.error("start auction error. auctionId[{}] not exists.", auctionId);
			return;
		}
		AuctionStatus status = auctionInfo.getAuctionStatus();
		//拍卖已开始
		if (status == AuctionStatus.AUCTIONING) {
			log.error("start auction error. auctionId[{}] has already started.", auctionId);
			return;
		}
		//拍卖已结束
		if (status == AuctionStatus.SUCCESS || status == AuctionStatus.FAILED) {
			log.error("start auction error. auctionId[{}] is over", auctionId);
			return;
		}
		//拍卖开始
		auctionService.startAuction(auctionInfo);
	}

	/**
	 * 拍卖结束
	 * @param auctionId 拍卖id
	 * @param count 累计出价次数
	 */
	public void endAuction(long auctionId,long count) {
		AuctionInfo auctionInfo = auctionService.getAuctionInfoById(auctionId);
		//拍卖信息不存在
		if (auctionInfo == null) {
			log.error("end auction error. auctionId[{}] not exists.", auctionId);
			return;
		}
		AuctionStatus status = auctionInfo.getAuctionStatus();
		//拍卖未开始
		if (status == AuctionStatus.NO_AUCTION) {
			log.error("end auction error. auctionId[{}] has not started.", auctionId);
			return;
		}
		//拍卖已结束
		if (status == AuctionStatus.SUCCESS || status == AuctionStatus.FAILED) {
			log.error("end auction error. auctionId[{}] is over", auctionId);
			return;
		}

		//暗拍场单独处理
		if (auctionInfo.getAuctionClass() == AuctionClass.SEALED) {
			sealedEndAuction(auctionInfo);
			return;
		}

		//拍卖结束
		auctionInfo = auctionService.endAuction(auctionInfo.getId(),count);
		//结束拍卖失败(包含延迟消息无效过滤的情况)则直接返回
		if (auctionInfo == null) {
			return;
		}

		//保存拍卖的属性
		saveAuctionAttributes(auctionInfo);

		//如果拍卖成交
		if (auctionInfo.getAuctionStatus() == AuctionStatus.SUCCESS) {
			Long userId = auctionInfo.getCurrentUserId();

			//更新我的竞拍相关信息
			auctionUserService.updateWinnerUserIdByAuctionId(userId, auctionId);

			//更新用户拍中次数最后拍中时间等信息
			beginnerService.auctionSuccess(userId, auctionInfo.getEndTime());
			//更新用户今天拍中的次数
			userService.incrTodayAuctionSuccessTimes(userId);

			//如果是免手续费场，则添加一条该用户的违约用户日志记录
			if (auctionInfo.getAuctionClass() == AuctionClass.FREE_AUCTION_FEE) {
				violationUserLogService.addViolationUserLog(auctionInfo);
			}
		}

        //如果拍卖结束，且判断是滚拍类型的，往滚拍线程添加生成下一期的事件
        Long nextAuctionId;
        if (auctionInfo.getType() == AuctionType.ROLL) {
            RollAuction rollAuction = rollAuctionService.getById(auctionInfo.getRollAuctionId());
            nextAuctionId = rollAuctionService.dealRollAuction(rollAuction);
            if (nextAuctionId != null) {
                auctionInfo.setNextId(nextAuctionId);
                auctionService.saveAuctionInfo(auctionInfo);
            }
        } else {
            nextAuctionId = auctionInfo.getNextId();
        }
        depositService.dealNextAuction(auctionId, nextAuctionId);


        //如拍卖成交则推送成交响应
		if (auctionInfo.getAuctionStatus() == AuctionStatus.SUCCESS) {
			//计算成交人是否是小户
			boolean smallUser = userService.isSmallUser(auctionInfo.getCurrentUserId());
			webSocketService.sendSuccessAuctionPushMessage(auctionId, auctionInfo.getEndTime(), auctionInfo.getCurrentPrice(),
					auctionInfo.getCurrentUserId(), auctionInfo.getNickname(), auctionInfo.getHeadImg(),
					auctionInfo.getVipLevel(), nextAuctionId, smallUser);
			//添加并推送跑马灯信息
			marqueeService.add(auctionInfo.getNickname(), auctionInfo.getGoodsName(), auctionInfo.getCurrentPrice());
		}
		//如流拍则推送流拍响应
		if (auctionInfo.getAuctionStatus() == AuctionStatus.FAILED) {
			webSocketService.sendFailedAuctionPushMessage(auctionId, auctionInfo.getEndTime(), nextAuctionId);
		}
	}

	/**
	 * 暗拍场拍卖结束
	 * @param auctionInfo 拍卖信息
	 */
	private void sealedEndAuction(AuctionInfo auctionInfo) {
		//保存拍卖属性
		saveAuctionAttributes(auctionInfo);
		//拍卖结束
		auctionService.endSealedAuction(auctionInfo);

		long auctionId = auctionInfo.getId();
		//如果拍卖成交
		if (auctionInfo.getAuctionStatus() == AuctionStatus.SUCCESS) {
			Long userId = auctionInfo.getCurrentUserId();

			//更新我的竞拍相关信息
			auctionUserService.updateWinnerUserIdByAuctionId(userId, auctionId);

			//更新用户拍中次数最后拍中时间等信息
			beginnerService.auctionSuccess(userId, auctionInfo.getEndTime());
			//更新用户今天拍中的次数
			userService.incrTodayAuctionSuccessTimes(userId);
			//添加一条该用户的违约用户日志记录
			violationUserLogService.addViolationUserLog(auctionInfo);

			//计算成交人是否是小户
			boolean smallUser = userService.isSmallUser(auctionInfo.getCurrentUserId());
			//推送成交响应
			webSocketService.sendSuccessAuctionPushMessage(auctionId, auctionInfo.getEndTime(), auctionInfo.getCurrentPrice(),
					auctionInfo.getCurrentUserId(), auctionInfo.getNickname(), auctionInfo.getHeadImg(),
					auctionInfo.getVipLevel(), null, smallUser);
			//添加并推送跑马灯信息
			marqueeService.add(auctionInfo.getNickname(), auctionInfo.getGoodsName(), auctionInfo.getCurrentPrice());
		}

		//如流拍则推送流拍响应
		if (auctionInfo.getAuctionStatus() == AuctionStatus.FAILED) {
			webSocketService.sendFailedAuctionPushMessage(auctionId, auctionInfo.getEndTime(), null);
		}
	}

	/**
	 * 保存拍卖的属性
	 *
	 * @param auctionInfo 拍卖信息
	 */
	private void saveAuctionAttributes(AuctionInfo auctionInfo) {
		long auctionId = auctionInfo.getId();
		AuctionStatus auctionStatus = auctionInfo.getAuctionStatus();

		int onlookerCount = auctionAttributeService.getOnlookerCount(auctionId, auctionStatus);
		int auctionUserCount;
		//暗拍场的出价人数获取方式不一样
		if (auctionInfo.getAuctionClass() == AuctionClass.SEALED) {
			auctionUserCount = sealedAuctionService.getAuctionedUserCount(auctionId, auctionStatus);
		} else {
			auctionUserCount = auctionAttributeService.getAuctionedUserCount(auctionId, auctionStatus);
		}

		List<AuctionAttribute> attributes = new LinkedList<>();
		attributes.add(new AuctionAttribute(auctionId, Attribute.ONLOOKER_COUNT, onlookerCount));
		attributes.add(new AuctionAttribute(auctionId, Attribute.AUCTION_USER_COUNT, auctionUserCount));

		auctionAttributeService.batchSaveAuctionAttributes(auctionId, attributes);
	}
}
