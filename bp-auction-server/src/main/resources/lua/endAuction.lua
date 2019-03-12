-- 拍卖key
local auctionKey = KEYS[1];
-- 延迟付款时间
local delayPaymentTime = tonumber(KEYS[2]);
--延迟消息计数KEY
local delayMessageCountKey = KEYS[3];
-- 延迟消息计数值
local count = tonumber(KEYS[4]);


redis.replicate_commands();

-- lua脚本返回数组
-- 第一个元素存放状态（-2:拍卖信息缓存不存在，-1:延迟消息已无效，0：非进行中的拍卖，1：结束拍卖成功），第二个元素存放拍卖信息
local result = {};
-- 获取拍卖信息
local auctionInfoStr = redis.call('GET', auctionKey);
if (not auctionInfoStr)
then
    result[1] = -2;
    return result;
end;

-- 转换为json对象
local auctionInfo = cjson.decode(auctionInfoStr);
local auctionStatus = auctionInfo["auctionStatus"];

-- 只有进行中的拍卖才能触发结束
if (auctionStatus ~= "AUCTIONING")
then
    result[1] = 0;
    return result;
end;

local delayMessageCount = redis.call('GET', delayMessageCountKey);
-- 如果Redis中的延迟消息计数不等于传入的计数值，说明中间又有人出过价,没法结束
if (tonumber(delayMessageCount) ~= count)
then
    result[1] = -1;
    return result;
end;

-- 需要判断是成交还是流拍，没有人出过价则流拍，否则成交
if (auctionInfo["currentUserId"] == nil and auctionInfo["auctionTimes"] == 0)
then
    auctionInfo["auctionStatus"] = "FAILED";
else
    -- 设置付款截止时间
    local arr = redis.call('TIME');
    local time = math.floor(arr[1] * 1000 + arr[2] / 1000);
    auctionInfo["paymentEndTime"] = time + delayPaymentTime;
    auctionInfo["auctionStatus"] = "SUCCESS";
end;
-- 更新redis值
auctionInfoStr = cjson.encode(auctionInfo);
redis.call('SET', auctionKey, auctionInfoStr);
redis.call('EXPIRE', auctionKey, 24*60*60);
result[1] = 1;
result[2] = auctionInfoStr;
return result;
