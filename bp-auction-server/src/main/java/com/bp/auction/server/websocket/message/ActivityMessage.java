package com.bp.auction.server.websocket.message;

import com.bp.auction.server.websocket.AbstractMessage;
import com.bp.auction.server.websocket.MessageDef;
import com.bp.auction.server.websocket.protobuf.ProtocolDataModel;
import com.google.protobuf.GeneratedMessageV3;

/**
 * @author zc
 * @create 2019-01-23 16:45
 * @desc
 **/
public class ActivityMessage extends AbstractMessage<ProtocolDataModel.ActivityRes> {
    private long activityId;
    //本次收集的数量
    private long num;
    //昨日收集的数量
    private long lastNum;
    //昨日获得的奖励数量
    private long lastAwardNum;

    public ActivityMessage(int code, long activityId, long num, long lastNum, long lastAwardNum) {
        super(MessageDef.ACTIVITY_RESPONSE, code);
        this.activityId = activityId;
        this.num = num;
        this.lastNum = lastNum;
        this.lastAwardNum = lastAwardNum;
    }

    @Override
    protected GeneratedMessageV3.Builder writeBuilder() {
        ProtocolDataModel.ActivityRes.Builder builder = ProtocolDataModel.ActivityRes.newBuilder();
        builder.setActivityId(activityId);
        builder.setNum(num);
        builder.setLastNum(lastNum);
        builder.setLastAwardNum(lastAwardNum);
        return builder;
    }
}
