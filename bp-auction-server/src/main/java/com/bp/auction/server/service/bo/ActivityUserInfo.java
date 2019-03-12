package com.bp.auction.server.service.bo;

import lombok.Data;

import java.io.Serializable;

@Data
public class ActivityUserInfo implements Serializable {

    private long userId;//用户ID

    private long num;//收集的总数量

    private int rank;//名次

    private long awardNum;//当前能获得的奖励数量

    private String nickName;//用户昵称

    private String headImg;//用户头像

}
