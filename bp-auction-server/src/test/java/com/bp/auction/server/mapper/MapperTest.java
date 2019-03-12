package com.bp.auction.server.mapper;

import com.bp.auction.server.dal.mapper.AuctionMapper;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.List;

/**
 * @author wcq
 * @version $Id: MapperTest.java, v0.1 2019/2/22 Exp $$
 */

@RunWith(SpringRunner.class)
@SpringBootTest
public class MapperTest {

    @Autowired
    private AuctionMapper auctionMapper;

    @Test
    public void testQuery() throws Exception {
        List<Long> ids = auctionMapper.findIdListInHall(1, 0);
        if(ids==null || ids.size()==0){
            System.out.println("is null");
        }else{
            System.out.println(ids.toString());
        }
    }
}
