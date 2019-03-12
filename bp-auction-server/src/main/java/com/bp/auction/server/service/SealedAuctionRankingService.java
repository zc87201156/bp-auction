package com.bp.auction.server.service;

import com.bp.auction.common.constants.RedisCacheKey;
import com.bp.auction.common.dal.entity.SealedAuctionRanking;
import com.bp.auction.server.dal.mapper.SealedAuctionRankingMapper;
import com.bp.auction.server.service.bo.SealedAuctionInfo;
import com.bp.auction.server.service.bo.SealedAuctionRankingInfo;
import com.bp.core.base.BaseServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.BoundValueOperations;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Date;
import java.util.LinkedList;
import java.util.List;

/**
 * <p>
 * 暗拍场用户定价排名记录 服务实现类
 * </p>
 *
 * @author zc
 * @since 2019-02-18
 */
@Service
public class SealedAuctionRankingService extends BaseServiceImpl<SealedAuctionRankingMapper, SealedAuctionRanking> {

    private static final int BATCH_NUM = 100;

    @Autowired
    private ConfigService configService;

    /**
     * 批量保存暗拍定价排名记录
     *
     * @param auctionId 拍卖id
     * @param infoList  定价排名记录
     */
    public void saveSealedAuctionRankings(long auctionId, List<SealedAuctionInfo> infoList) {
        Date now = new Date();
        List<SealedAuctionRanking> temp = new LinkedList<>();
        for (int i = 0; i < infoList.size(); i++) {
            if (i != 0 && i % BATCH_NUM == 0) {
                super.baseMapper.batchInsert(temp);
                temp.clear();
            }
            SealedAuctionInfo sai = infoList.get(i);

            SealedAuctionRanking sar = new SealedAuctionRanking();
            sar.setAuctionId(auctionId);
            sar.setUserId(sai.getUserId());
            sar.setNickname(sai.getNickname());
            sar.setHeadImg(sai.getHeadImg());
            sar.setPrice(sai.getPrice());
            sar.setRank(i + 1);
            sar.setAuctionTime(sai.getUpdateTime());
            sar.setCreateTime(now);

            temp.add(sar);
            //预热每个出价用户的定价排名缓存，避免拍卖结束时客户端同时请求我的排名接口导致瞬间并发查询数据库
            BoundValueOperations boundValueOperations = redisTemplate.boundValueOps(RedisCacheKey.MY_SEALED_AUCTION_RANKING.key(auctionId, sai.getUserId()));
            boundValueOperations.set(sar);
        }
        if (!temp.isEmpty()) {
            saveBatch(temp);
        }
        //预热定价排名首页缓存，避免拍卖结束时并发查库
        loadFirstPage(auctionId);
    }

    /**
     * 获取暗拍场我的定价排名
     *
     * @param auctionId 拍卖id
     * @param userId    用户id
     * @return
     */
    public SealedAuctionRanking getMyRanking(long auctionId, long userId) {
        return cache(RedisCacheKey.MY_SEALED_AUCTION_RANKING.key(auctionId, userId),
                () -> baseMapper.getMyRanking(auctionId, userId));
    }

    /**
     * 分页查询暗拍定价排名列表，第一页数据缓存，其余页数据直接从数据库查询
     *
     * @param auctionId 拍卖id
     * @param page      页数
     * @return
     */
    public List<SealedAuctionRankingInfo> findByPage(long auctionId, int page) {
        if (page <= 0) {
            page = 1;
        }
        //第一页数据缓存
        if (page == 1) {
            return loadFirstPage(auctionId);
        }
        int pageSize = getPageSize();
        int start = (page - 1) * pageSize;

        List<SealedAuctionRanking> list = super.baseMapper.findByPage(auctionId, start, pageSize);
        List<SealedAuctionRankingInfo> result = new ArrayList<>(list.size());
        for (SealedAuctionRanking sar : list) {
            result.add(new SealedAuctionRankingInfo(sar));
        }
        return result;
    }

    private int getPageSize() {
        int pageSize = configService.getQuerySealedAuctionRankingPageSize();
        //默认显示10条
        return pageSize <= 0 ? 10 : pageSize;
    }

    /**
     * 查询暗拍排名列表首页数据并生成缓存
     *
     * @param auctionId 拍卖id
     * @return
     */
    private List<SealedAuctionRankingInfo> loadFirstPage(long auctionId) {
        return cache(RedisCacheKey.SEALED_AUCTION_RANKING_FIRST_PAGE_LIST.key(auctionId),
                () -> {
                    List<SealedAuctionRanking> list = baseMapper.findByPage(auctionId, 0, getPageSize());
                    List<SealedAuctionRankingInfo> result = new ArrayList<>(list.size());
                    for (SealedAuctionRanking sar : list) {
                        result.add(new SealedAuctionRankingInfo(sar));
                    }
                    return result;
                });
    }
}
