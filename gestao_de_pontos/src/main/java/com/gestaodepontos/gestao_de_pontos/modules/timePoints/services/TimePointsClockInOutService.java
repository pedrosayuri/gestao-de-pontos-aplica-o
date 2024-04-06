package com.gestaodepontos.gestao_de_pontos.modules.timePoints.services;

import java.time.LocalDate;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.gestaodepontos.gestao_de_pontos.modules.timePoints.entities.TimePointsEntity;
import com.gestaodepontos.gestao_de_pontos.modules.timePoints.respositories.TimePointsRepository;
import com.gestaodepontos.gestao_de_pontos.modules.users.repositories.UserRepository;

@Service
public class TimePointsClockInOutService {
    
    @Autowired
    private TimePointsRepository timePointsRepository;

    @Autowired
    private UserRepository userRepository;

    public TimePointsEntity timePointsClockInOut(TimePointsEntity timePointsEntity, LocalDate localDatePoints) {
        var userResult = userRepository.findById(timePointsEntity.getUserId()).orElseThrow(() -> new RuntimeException("Usuário não encontrado."));

        userResult.getUserRole();

        if (userResult.getWorkRegime().toString().equals("SEIS_HORAS")) {
            int todayPoints = this.timePointsRepository.countByUserIdAndTimestamp(timePointsEntity.getUserId(), localDatePoints);

            if (todayPoints >= 2) {
                throw new RuntimeException("Você já registrou 2 pontos hoje.");
            }
        }

        return this.timePointsRepository.save(timePointsEntity);
    }
}
