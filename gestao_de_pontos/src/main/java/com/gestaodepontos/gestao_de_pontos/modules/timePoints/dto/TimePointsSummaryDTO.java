package com.gestaodepontos.gestao_de_pontos.modules.timePoints.dto;

import java.util.List;

import com.gestaodepontos.gestao_de_pontos.modules.timePoints.entities.TimePointsEntity;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TimePointsSummaryDTO {

    private List<TimePointsEntity> timePointsEntities;
    private String workedHoursInADay;
    private boolean isFullWorkDay;
    private String remainingTime;
    private String extraTime;
    
    public boolean isEmpty() {
        return timePointsEntities == null || timePointsEntities.isEmpty();
    }

    public String getRemainingTime() {
        if (!isFullWorkDay) {
            return remainingTime;
        } else {
            return null;
        }
    }

    public String getExtraTime() {
        if (isFullWorkDay) {
            return extraTime;
        } else {
            return null;
        }
    }

}
