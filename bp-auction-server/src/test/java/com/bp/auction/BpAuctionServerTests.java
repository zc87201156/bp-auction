package com.bp.auction;

import com.bp.auction.common.constants.AuctionConstants;
import com.bp.auction.common.constants.BusinessType;
import com.bp.auction.common.util.SysUtil;
import com.bp.auction.server.handler.HttpApiHandler;
import com.bp.auction.server.service.UserService;
import com.bp.core.utils.GfJsonUtil;
import com.bp.platform.rpc.dto.CreateOrderInfoDto;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringBootConfiguration;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.cloud.netflix.eureka.EnableEurekaClient;
import org.springframework.cloud.openfeign.EnableFeignClients;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@RunWith(SpringRunner.class)
@SpringBootTest
@SpringBootConfiguration
@EnableEurekaClient
@EnableFeignClients(basePackages = {"com.bp.auction.rpc"})
@ComponentScan("com.bp")
@MapperScan("com.bp.auction.server.dal.mapper")
public class BpAuctionServerTests {
    @Autowired
    HttpApiHandler httpApiHandler;

    @Autowired
    RabbitTemplate rabbitTemplate;
    @Autowired
    UserService userService;

    @Test
    public void testHttpApiHandler() {
      /*  System.out.println(httpApiHandler.getCatVipLev(441773l));
        System.out.println(httpApiHandler.getParentChannel(441773l));
        System.out.println(httpApiHandler.isGray(441773l));
        System.out.println(httpApiHandler.getProductAwards(1,1l));*/
       System.out.println(httpApiHandler.lockAccount(441773l,1));
       // httpApiHandler.unLockAccount(441773l);
    /*    CreateOrderInfoDto createOrderInfoDto=new CreateOrderInfoDto();
        createOrderInfoDto.setUserId(441773l);
        createOrderInfoDto.setGameId(AuctionConstants.GAME_ID);
        createOrderInfoDto.setChannelId(100000l);
        createOrderInfoDto.setCouponId(1l);
        httpApiHandler.newOrder(createOrderInfoDto);
        System.out.println(SysUtil.getEnvironment());*/

        //httpApiHandler.updateAccount(-100, BusinessType.ACTIVITY_AWARD,10000,441773l,100000l);
    }

    @Test
    public void testSend() {
        Map<String, String> map = new HashMap<>();
        map.put("bizId", "biz00001");
        map.put("orderNo", "order000002");
        map.put("paymentTime", "2018-03-22");
        rabbitTemplate.convertAndSend("zwf_mq", map);
    }

    @Test
    public void testUser(){
        userService.updateUserCoin(5L,10000L,100L,BusinessType.AUCTION_FEE,6565312543213165L);
    }

}

