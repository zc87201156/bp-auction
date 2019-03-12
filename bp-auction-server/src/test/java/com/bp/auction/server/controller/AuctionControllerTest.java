package com.bp.auction.server.controller;

import com.bp.auction.common.dal.entity.RollAuction;
import com.bp.auction.server.dal.mapper.RollAuctionMapper;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

/**
 * @author wcq
 * @version $Id: AuctionControllerTest.java, v0.1 2019/2/21 Exp $$
 */

@RunWith(SpringRunner.class)
@SpringBootTest
public class AuctionControllerTest {

    private MockMvc mvc;

    @Autowired
    private RollAuctionMapper rollAuctionMapper;

    @Test
    public void testQuery() throws Exception {
        List<RollAuction> users = rollAuctionMapper.listRollAuctions(0);
        if(users==null || users.size()==0){
            System.out.println("is null");
        }else{
            System.out.println(users.toString());
        }
    }
}
