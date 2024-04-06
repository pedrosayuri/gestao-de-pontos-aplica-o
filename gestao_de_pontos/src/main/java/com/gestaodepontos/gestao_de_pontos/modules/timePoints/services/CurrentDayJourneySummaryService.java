package com.gestaodepontos.gestao_de_pontos.modules.timePoints.services;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.gestaodepontos.gestao_de_pontos.modules.timePoints.dto.TimePointsSummaryDTO;
import com.gestaodepontos.gestao_de_pontos.modules.timePoints.entities.TimePointsEntity;
import com.gestaodepontos.gestao_de_pontos.modules.timePoints.respositories.TimePointsRepository;
import com.gestaodepontos.gestao_de_pontos.modules.users.repositories.UserRepository;

@Service
public class CurrentDayJourneySummaryService {
    
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TimePointsRepository timePointsRepository;

    public TimePointsSummaryDTO getPointsByDay(Long userId, LocalDate date) {
        var userResult = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("Usuário não encontrado."));
    
        String workRegimeUser = "";
        if (userResult.getWorkRegime().toString().equals("SEIS_HORAS")) {
            workRegimeUser = "06:00:00";
        } else if (userResult.getWorkRegime().toString().equals("OITO_HORAS")) {
            workRegimeUser = "08:00:00";
        }
    
        String workedHoursinADay = timePointsRepository.getWorkedHoursInADay(userId, date);
        
        boolean isFullWorkDay = isFullWorkDay(workRegimeUser, userId, date, workedHoursinADay);

        String remainingTimeStr = getRemainingTime(workRegimeUser, userId, date, workedHoursinADay);

        String extraTimeStr = getExtraTime(workRegimeUser, userId, date, workedHoursinADay);
    
        List<TimePointsEntity> timePoints = timePointsRepository.findByUserIdAndTimestamp(userId, date);
    
        TimePointsSummaryDTO summary = new TimePointsSummaryDTO();
        summary.setTimePointsEntities(timePoints);
        summary.setWorkedHoursInADay(workedHoursinADay);
        summary.setFullWorkDay(isFullWorkDay);
        summary.setRemainingTime(remainingTimeStr);
        summary.setExtraTime(extraTimeStr);
    
        return summary;
    }

    private boolean isFullWorkDay(String workRegimeUser, Long userId, LocalDate date, String workedHoursinADay) {
        LocalTime workedHours = LocalTime.parse(workedHoursinADay);
        LocalTime workRegime = LocalTime.parse(workRegimeUser);

        int compare = workedHours.compareTo(workRegime);

        if (compare > 0 || compare == 0) {
            return true;
        } else {
            return false;
        }
    }

    private String getRemainingTime(String workRegimeUser, Long userId, LocalDate date, String workedHoursinADay) {
        LocalTime workedHours = LocalTime.parse(workedHoursinADay);
        LocalTime workRegime = LocalTime.parse(workRegimeUser);

        int compare = workedHours.compareTo(workRegime);

        if (compare > 0 || compare == 0) {
            return "00:00:00";
        } else {
            LocalTime remainingTime = workRegime.minusHours(workedHours.getHour()).minusMinutes(workedHours.getMinute()).minusSeconds(workedHours.getSecond());
            return remainingTime.toString();
        }
    }

    private String getExtraTime(String workRegimeUser, Long userId, LocalDate date, String workedHoursinADay) {
        LocalTime workedHours = LocalTime.parse(workedHoursinADay);
        LocalTime workRegime = LocalTime.parse(workRegimeUser);

        int compare = workedHours.compareTo(workRegime);

        if (compare > 0 || compare == 0) {
            return workedHours.minusHours(workRegime.getHour()).minusMinutes(workRegime.getMinute()).minusSeconds(workRegime.getSecond()).toString();
        } else {
            return "00:00:00";
        }
    }
}
