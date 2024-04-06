package com.gestaodepontos.gestao_de_pontos.TimePointsTest;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import com.gestaodepontos.gestao_de_pontos.modules.timePoints.dto.TimePointsSummaryDTO;
import com.gestaodepontos.gestao_de_pontos.modules.timePoints.entities.TimePointsEntity;
import com.gestaodepontos.gestao_de_pontos.modules.timePoints.respositories.TimePointsRepository;
import com.gestaodepontos.gestao_de_pontos.modules.timePoints.services.CurrentDayJourneySummaryService;
import com.gestaodepontos.gestao_de_pontos.modules.users.entities.UserEntity;
import com.gestaodepontos.gestao_de_pontos.modules.users.repositories.UserRepository;
import com.gestaodepontos.gestao_de_pontos.modules.users.enums.UserRegime;

public class CurrentDayJourneySummaryServiceTest {

    @InjectMocks
    private CurrentDayJourneySummaryService currentDayJourneySummaryService;

    @Mock
    private UserRepository userRepository;

    @Mock
    private TimePointsRepository timePointsRepository;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testGetPointsByDay() {
        UserEntity userEntity = new UserEntity();
        userEntity.setId(1L);
        userEntity.setWorkRegime(UserRegime.OITO_HORAS);
        when(userRepository.findById(any(Long.class))).thenReturn(Optional.of(userEntity));

        List<TimePointsEntity> timePointsList = new ArrayList<>();
        when(timePointsRepository.findByUserIdAndTimestamp(any(Long.class), any(LocalDate.class))).thenReturn(timePointsList);
        when(timePointsRepository.getWorkedHoursInADay(any(Long.class), any(LocalDate.class))).thenReturn("08:00:00");

        TimePointsSummaryDTO summaryDTO = currentDayJourneySummaryService.getPointsByDay(1L, LocalDate.now());

        assertNotNull(summaryDTO);
    }

}
