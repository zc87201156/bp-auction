package com.bp.auction.server.controller.job;

import com.bp.auction.common.dal.entity.ViolationUserLog;
import com.bp.auction.server.service.ConfigService;
import com.bp.auction.server.service.FreeAuctionFeeService;
import com.bp.auction.server.service.ViolationUserService;
import lombok.extern.slf4j.Slf4j;
import org.apache.commons.lang3.exception.ExceptionUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Created with IDEA
 * Author:qyl
 * Date:2019/2/22
 * Time:15:23
 * Desc:免手续费场接口
 */
@Slf4j
@RestController
@RequestMapping("/auction/job/auction_free")
public class FreeAuctionFeeJob {


    @Autowired
    private FreeAuctionFeeService freeAuctionFeeService;

    @Autowired
    private ViolationUserService violationUserService;

    @Autowired
    private ConfigService configService;

    /**
     * 处理免手续费场用户超时未支付违约行为
     */
    @RequestMapping("/breach")
    public void execute() {
        try {
            process();
        } catch (Exception e) {
            log.error("execute free auction fee job error. ex:{}", ExceptionUtils.getStackTrace(e));
        }
    }

    /**
     * 处理所有已过期未支付的用户为违约用户
     *
     * @throws Exception
     */
    private void process() throws Exception {
        long start = System.currentTimeMillis();
        //查询已过期未处理的违约用户记录,记录按主键排序，也即按时间顺序排序
        List<ViolationUserLog> userLogs = freeAuctionFeeService.findViolationList();
        //如没有违约用户记录则直接返回
        if (userLogs.isEmpty()) {
            return;
        }
        Map<Long, ViolationUserLog> violationUserMap = new HashMap<>();
        for (ViolationUserLog log : userLogs) {
            boolean success = freeAuctionFeeService.processViolationUserLog(log);
            //如果违约用户处理成功，则将违约用户放入map中待处理,如果一个用户有多条违约记录，取最近的一条违约记录
            //处理不成功则可能是被支付回调处理了，则等待下一次job任务调用
            if (success) {
                violationUserMap.put(log.getUserId(), log);
            }
        }
        //如果没有违约用户信息被更新成功则返回，等待下一次job任务调用
        if (violationUserMap.isEmpty()) {
            return;
        }
        //从配置项中获取违约保证金
        long bailAmount = configService.getFreeAuctionFeeBailAmount();

        //挨个处理违约用户
        for (ViolationUserLog log : violationUserMap.values()) {
            violationUserService.userViolate(log.getUserId(), log.getPaymentEndTime(), log.getAuctionId(), bailAmount,
                    log.getGoodsName());
        }
        long ms = System.currentTimeMillis() - start;
        log.info("{} violated users has been processed in {} ms.", violationUserMap.size(), ms);
    }
}
