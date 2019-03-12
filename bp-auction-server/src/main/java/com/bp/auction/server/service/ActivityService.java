package com.bp.auction.server.service;

import com.bp.auction.common.constants.*;
import com.bp.auction.common.dal.entity.Activity;
import com.bp.auction.common.dal.entity.ActivityProbability;
import com.bp.auction.common.dal.entity.ActivityUserLog;
import com.bp.auction.server.dal.mapper.ActivityMapper;
import com.bp.auction.server.service.bo.ActivityUserInfo;
import com.bp.auction.server.service.bo.RankingData;
import com.bp.core.base.BaseServiceImpl;
import com.bp.core.cache.CacheKey;
import com.bp.core.utils.type.DateUtils;
import com.bp.core.utils.type.TimeUtils;
import com.bp.platform.rpc.dto.UserDto;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.BoundHashOperations;
import org.springframework.data.redis.core.BoundZSetOperations;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import java.util.*;
import java.util.concurrent.TimeUnit;

/**
 * <p>
 * 服务实现类
 * </p>
 *
 * @author zc
 * @since 2019-02-18
 */
@Slf4j
@Service
public class ActivityService extends BaseServiceImpl<ActivityMapper, Activity> {
    @Autowired
    private ActivityProbabilityService activityProbabilityService;
    @Autowired
    private ActivityUserLogService activityUserLogService;
    @Autowired
    private WebSocketService webSocketService;

    @Autowired
    private UserService userService;

    private static final String BLANK = "";

    @Override
    protected void clearCache(Activity entity) {
        redisTemplate.delete(RedisCacheKey.ACTIVITY_LIST.key());
    }

    private String getActivityDayUserKey(long activityId, long issue) {
        return RedisCacheKey.ACTIVITY_DAY_USER.key(activityId, issue);
    }

    private String getActivityDayTotalKey(long activityId, long issue) {
        return RedisCacheKey.ACTIVITY_DAY_TOTAL.key(activityId, issue);
    }


    /***
     * 根据活动Id获取活动配置信息
     * @param activityId
     * @return
     */

    public Activity getById(long activityId) {
        List<Activity> list = listValidActivity();
        if (CollectionUtils.isEmpty(list)) {
            return null;
        }
        for (Activity activity : list) {
            if (activity.getId() == activityId) {
                return activity;
            }
        }
        return null;
    }

    public List<Activity> listValidActivity() {
        return cache(RedisCacheKey.ACTIVITY_LIST.key(), () -> baseMapper.listValidActivity());
    }


    /***
     *
     * @param userId--用户ID
     * @param activityOperateType--操作类型
     */

    @Async
    public void dealActivity(long userId, ActivityOperateType activityOperateType) {
        //目前同时只可能有一个有效活动
        List<Activity> list = listValidActivity();
        if (CollectionUtils.isEmpty(list)) {
            log.warn("noValid activity.");
            return;
        }
        Activity activity = list.get(0);

        //校验活动时间是否在范围内
        Date now = new Date();
        if (now.before(activity.getStartTime()) || now.after(activity.getEndTime())) {
            log.warn("activity not in time.activityId:{}", activity.getId());
            return;
        }
        String nowStr = DateUtils.formatCurrentDateYMD();
        int issue = Integer.parseInt(nowStr);

        String cacheKey = getActivityDayUserKey(activity.getId(), issue);
        long num = 0;

        BoundZSetOperations boundZSetOperations = redisTemplate.boundZSetOps(cacheKey);
        Double dScore = boundZSetOperations.score(userId + BLANK);
        if (dScore != null) {
            //值需要转一下，转成具体的数值
            num = TimeUtils.reConvertNum(dScore.longValue());
        }
        switch (activityOperateType) {
            case LOGIN:
                //判断是否是当日首次登陆，首次登陆必送一张
                if (judgeUserFirstLogin(userId, issue)) {
                    addNum(activity.getId(), issue, userId, num, cacheKey);
                    //同时需要判断昨天是否获得过奖励，如果有需要推送一条昨日奖励消息
                    long lastIssue = Long.parseLong(DateUtils.formatDate(DateUtils.addDays(now, -1)));
                    ActivityUserLog userLog = activityUserLogService.getUserLog(activity.getId(), lastIssue, userId);
                    long lastNum = 0;
                    long lastAwardNum = 0;
                    if (userLog != null) {
                        lastNum = userLog.getNum();
                        lastAwardNum = userLog.getAwardNum();
                    }
                    webSocketService.sendActivityMessage(activity.getId(), 1, lastNum, lastAwardNum, userId);
                }
                break;
            //出价有概率赠送
            case AUCTION:
                if (judgeIsAuctionGen(activity.getId(), num)) {
                    addNum(activity.getId(), issue, userId, num, cacheKey);
                    //推送给前端获得了一个新的福
                    webSocketService.sendActivityMessage(activity.getId(), 1, 0, 0, userId);
                }
                break;
        }
    }


    /***
     * 收集一个新福的逻辑
     * @param activityId
     * @param issue
     * @param userId
     * @param num
     * @param cacheKey
     */

    private void addNum(long activityId, long issue, long userId, long num, String cacheKey) {
        String dayTotalKey = getActivityDayTotalKey(activityId, issue);
        num = num + 1;
        //便于带更新时间戳进行排序
        long tmpScore = TimeUtils.convertNumAndTimeStamp(num, System.currentTimeMillis());

        BoundZSetOperations boundZSetOperations = redisTemplate.boundZSetOps(cacheKey);
        boundZSetOperations.add(userId + BLANK, tmpScore);
        boundZSetOperations.expire(CacheKey.DAY_3, TimeUnit.SECONDS);

        //当日总数累计加1
        boundZSetOperations.incrementScore(dayTotalKey, CacheKey.DAY_3);
    }


    /**
     * 获取某期榜单前多少名用户
     *
     * @param activityId
     * @param issue
     * @return
     */

    public List<ActivityUserInfo> getActivityUserInfo(long activityId, long issue) {
        Activity activity = getById(activityId);
        if (activity == null) {
            return null;
        }
        //该活动榜单用户数量
        int rankNum = activity.getRankNum();
        String rankCacheKey = getActivityDayUserKey(activityId, issue);
        Set set = redisTemplate.boundZSetOps(rankCacheKey).reverseRangeWithScores(0, rankNum - 1);
        List<RankingData> rankList = new ArrayList<>(set);
        //当天收集的总数量
        Object val = redisTemplate.boundValueOps((getActivityDayTotalKey(activityId, issue))).get();
        long totalNum = val == null ? 1 : Long.parseLong(val.toString());
        List<ActivityUserInfo> userList = new ArrayList<>();
        for (int i = 0; i < rankList.size(); i++) {
            RankingData rankingData = rankList.get(i);
            ActivityUserInfo activityUserInfo = new ActivityUserInfo();
            activityUserInfo.setUserId(Long.parseLong(rankingData.getElement() + BLANK));
            activityUserInfo.setRank(i + 1);
            activityUserInfo.setNum(TimeUtils.reConvertNum((long) rankingData.getScore()));
            UserDto userDto = userService.getByUserId(activityUserInfo.getUserId());
            if (userDto != null) {
                activityUserInfo.setNickName(userDto.getNickname());
                activityUserInfo.setHeadImg(userDto.getHeadImg());
            }
            long awardNum = (int) (activityUserInfo.getNum() / (totalNum * 1.00) * activity.getAwardNum());//计算应获得的奖励数量
            activityUserInfo.setAwardNum(awardNum < 1 ? 1 : awardNum);
            userList.add(activityUserInfo);
        }
        return userList;
    }


    /**
     * 查询我的榜单信息
     *
     * @param userId
     * @param activityId
     * @param issue
     * @return
     */

    public ActivityUserInfo getMyInfo(long userId, long activityId, long issue) {
        Activity activity = getById(activityId);
        if (activity == null) {
            return null;
        }
        ActivityUserInfo myInfo = new ActivityUserInfo();
        String rankCacheKey = getActivityDayUserKey(activityId, issue);

        Object valStr = redisTemplate.boundValueOps(getActivityDayTotalKey(activityId, issue)).get();
        long totalNum = valStr == null ? 0 : Long.parseLong(valStr.toString());
        Long val = redisTemplate.boundZSetOps(rankCacheKey).reverseRank(userId + BLANK);
        int myRank = val == null ? -1 : val.intValue() + 1;//排名需要将redis索引值加1
        Double score = redisTemplate.boundZSetOps(rankCacheKey).score(userId + BLANK);
        long myNum = score == null ? 0 : TimeUtils.reConvertNum(score.longValue());//我的数量
        long myAwardNum = (int) (myNum / (totalNum * 1.00) * activity.getAwardNum());//计算我的奖励数量
        myInfo.setRank(myRank);
        myInfo.setNum(myNum);
        myInfo.setAwardNum(myAwardNum < 1 ? 1 : myAwardNum);
        myInfo.setUserId(userId);
        UserDto userDto = userService.getByUserId(userId);
        if (userDto != null) {
            myInfo.setNickName(userDto.getNickname());
            myInfo.setHeadImg(userDto.getHeadImg());
        }
        return myInfo;
    }


    /***
     * 判断用户是否当天首次登陆
     * @param userId
     * @return
     */

    private boolean judgeUserFirstLogin(long userId, long issue) {
        String key = RedisCacheKey.USER_DAY_LOGIN.key(issue);
        List<Integer> list = redisTemplate.boundHashOps(key).values();
        if (CollectionUtils.isEmpty(list)) {
            //同时记录下用户当天登陆记录
            BoundHashOperations boundHashOperations = redisTemplate.boundHashOps(key);
            boundHashOperations.put(key, userId + BLANK);
            boundHashOperations.expire(CacheKey.DAY_1, TimeUnit.SECONDS);
            return true;
        }
        return false;
    }


    /**
     * 判断出价是否生成新福
     *
     * @param activityId
     * @param num
     * @return
     */

    private boolean judgeIsAuctionGen(long activityId, long num) {
        //如果第一次一个也没有，默认赠送一个
        if (num == 0) {
            return true;
        }
        List<ActivityProbability> list = activityProbabilityService.listProbability(activityId);
        if (CollectionUtils.isEmpty(list)) {
            return false;
        }
        //生成福的概率(默认是最后一个最小的概率)
        double chance = list.get(list.size() - 1).getProbability();
        for (ActivityProbability probabilityConfig : list) {
            if (num == probabilityConfig.getNum()) {
                chance = probabilityConfig.getProbability();
                break;
            }
        }
        double random = Math.random();
        log.info("chance:{} random:{} ", chance, random);
        if (random <= chance) {
            return true;
        }
        return false;
    }


    /***
     * 发送活动奖励
     */

    public void sendAward(Date date) {
        List<Activity> activityList = listValidActivity();
        if (CollectionUtils.isEmpty(activityList)) {
            return;
        }
        //目前只考虑同时一个有效活动
        Activity activity = activityList.get(0);
        long issue = Long.parseLong(DateUtils.formatDate(date,"yyyyMMdd"));
        //防止重复结算

        if (setNX(RedisCacheKey.ACTIVITY_DAY_HAS_AWARD.key(activity.getId(), issue), 1, CacheKey.DAY_1)) {
            String rankCacheKey = getActivityDayUserKey(activity.getId(), issue);
            String totalCacheKey = getActivityDayTotalKey(activity.getId(), issue);

            Object totalVal = redisTemplate.boundValueOps(totalCacheKey).get();
            long totalNum = totalVal == null ? 1 : Long.parseLong(totalVal.toString());//当天所有人收集的总数量
            //根据排名由高到低获取所有用户
            BoundZSetOperations boundZSetOperations = redisTemplate.boundZSetOps(rankCacheKey);
            List<RankingData> list = new ArrayList<>(boundZSetOperations.rangeWithScores(0, -1));
            if (!CollectionUtils.isEmpty(list)) {
                int i = 0;
                List<ActivityUserLog> logList = new LinkedList<>();
                for (RankingData rankingData : list) {
                    ActivityUserLog userLog = new ActivityUserLog();
                    //userLog.setId(nextId());
                    userLog.setActivityId(activity.getId());
                    userLog.setIssue(issue);
                    userLog.setUserId(Long.parseLong(rankingData.getElement() + BLANK));
                    userLog.setRankNum(i + 1);
                    userLog.setNum(TimeUtils.reConvertNum((long) rankingData.getScore()));
                    //至少分给用户1金叶子
                    long awardNum = (long) (userLog.getNum() / (totalNum * 1.00) * activity.getAwardNum());
                    userLog.setAwardNum(awardNum < 1 ? 1 : awardNum);
                    userLog.setAwardStatus(YesOrNo.NO.getValue());//默认奖励状态为未发放
                    Long channeId = userService.getUserChannelId(userLog.getUserId());
                    if (channeId != null) {
                        //给用户发金叶子
                        int code = userService.updateUserCoin(userLog.getUserId(), channeId, -1 * userLog.getAwardNum(), BusinessType.ACTIVITY_AWARD, userLog.getId());
                        if (code == ErrorCode.SUCCESS) {
                            userLog.setAwardStatus(YesOrNo.YES.getValue());//奖励状态变为已发放
                        } else {
                            log.error("send activityAward userId:{} channeId:{} activityId:{} issue:{} fail.", userLog.getUserId(), channeId, userLog.getActivityId(), userLog.getIssue());
                        }
                    }
                    i++;
                    logList.add(userLog);
                }
                //批量保存活动日志
                activityUserLogService.saveBatch(logList);
            }
            log.info("sendAward activity:{} issue:{} success!!!", activity.getId(), issue);
        }
    }

    private Boolean setNX(String key, Object value, Integer expireTime) {
        Boolean result = redisTemplate.opsForValue().setIfAbsent(key, value);
        if (result && expireTime != null) {
            redisTemplate.expire(key, expireTime, TimeUnit.SECONDS);
        }
        return result;
    }

}
