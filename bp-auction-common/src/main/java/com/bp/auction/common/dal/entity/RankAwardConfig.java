package com.bp.auction.common.dal.entity;

import com.bp.core.base.BaseEntity;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.experimental.Accessors;

/**
 * <p>
 * 
 * </p>
 *
 * @author zc
 * @since 2019-02-18
 */
@Data
@EqualsAndHashCode(callSuper = true)
@Accessors(chain = true)
public class RankAwardConfig extends BaseEntity {

    private static final long serialVersionUID = 1L;

    /**
     * 榜单类型 1-杠神榜 2-拍神榜
     */
    private Integer rankType;

    /**
     * 榜单名次
     */
    private Integer rankNum;

    /**
     * 奖品名称
     */
    private String awardName;

    /**
     * 奖品图片路径
     */
    private String awardImage;

    /**
     * 平台奖品类型
     */
    private Integer platAwardType;

    /**
     * 平台送金叶子数量
     */
    private Long platBusinessAmount;

    /**
     * 平台碎片id
     */
    private Long platFragmentId;

    /**
     * 平台碎片数量
     */
    private Integer platFragmentNum;

    /**
     * 平台实物id
     */
    private Long platPhyAwardsId;


}
