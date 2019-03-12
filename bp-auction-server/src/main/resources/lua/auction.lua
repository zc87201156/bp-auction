--拍卖key
local auctionKey = KEYS[1];
--竞拍用户id
local userId = tonumber(KEYS[2]);
--倒计时时长(毫秒)
local countdownTime = tonumber(KEYS[3]);
--延迟消息计数KEY
local delayMessageCountKey = KEYS[4];

redis.replicate_commands();
--lua脚本返回数组
local result = {};
local auctionInfoStr = redis.call('GET', auctionKey);
-- 拍卖信息缓存不存在
if (not auctionInfoStr)
then
    result[1] = 1004;
    return result;
end;
--转换为json对象
local auctionInfo = cjson.decode(auctionInfoStr);
local auctionStatus = auctionInfo["auctionStatus"];
--拍卖已结束
if (auctionStatus == "SUCCESS" or auctionStatus == "FAILED")
then
    result[1] = 1006;
    return result;
end;
local currentUserId = tonumber(auctionInfo["currentUserId"]);
-- 用户已领先
if (currentUserId == userId)
then
    result[1] = 1009;
    return result;
end;
--设置当前出价人
auctionInfo["currentUserId"] = userId;
-- 获取当前服务器时间
local arr = redis.call('TIME');
local currentTime = math.floor(arr[1] * 1000 + arr[2] / 1000);
local endTime = currentTime + countdownTime;
--设置拍卖结束时间
auctionInfo["endTime"] = endTime;
-- 拍卖次数+1
local auctionTimes = auctionInfo["auctionTimes"];
auctionTimes = auctionTimes + 1;
auctionInfo["auctionTimes"] = auctionTimes;

-- 更新拍卖信息缓存
auctionInfoStr = cjson.encode(auctionInfo);
redis.call('SET', auctionKey, auctionInfoStr);
redis.call('EXPIRE', auctionKey, 24*60*60);

--更新延迟消息计数值
local delayMessageCount = redis.call('INCR', delayMessageCountKey);
redis.call('EXPIRE', delayMessageCountKey, 7*24*60*60);

result[1] = 0;
result[2] = auctionInfoStr;
result[3] = delayMessageCount;
return result;