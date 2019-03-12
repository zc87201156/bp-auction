package com.bp.auction.server.service.bo;

import lombok.Data;

@Data
public class RankingData {
    private Object element;
    private double score;

    public RankingData(Object element, double score) {
        this.element = element;
        this.score = score;
    }
}
