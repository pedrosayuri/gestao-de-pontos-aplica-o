package com.gestaodepontos.gestao_de_pontos.TimePointsTest;

import com.gestaodepontos.gestao_de_pontos.modules.timePoints.entities.TimePointsEntity;
import com.gestaodepontos.gestao_de_pontos.modules.timePoints.respositories.TimePointsRepository;
import com.gestaodepontos.gestao_de_pontos.modules.timePoints.services.TimePointsClockInOutService;
import com.gestaodepontos.gestao_de_pontos.modules.users.entities.UserEntity;
import com.gestaodepontos.gestao_de_pontos.modules.users.enums.UserRegime;
import com.gestaodepontos.gestao_de_pontos.modules.users.repositories.UserRepository;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.time.LocalDate;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

public class TimePointsClockInOutServiceTest {

    @InjectMocks
    private TimePointsClockInOutService timePointsClockInOutService;

    @Mock
    private TimePointsRepository timePointsRepository;

    @Mock
    private UserRepository userRepository;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.openMocks(this);
    }

@Test
public void testTimePointsClockInOut() {
    Long userId = 1L;
    LocalDate date = LocalDate.now();

    UserEntity user = new UserEntity();
    user.setWorkRegime(UserRegime.SEIS_HORAS);

    TimePointsEntity timePointsEntity = new TimePointsEntity();
    timePointsEntity.setUserId(userId);

    when(userRepository.findById(userId)).thenReturn(Optional.of(user));
    when(timePointsRepository.countByUserIdAndTimestamp(userId, date)).thenReturn(1);
    when(timePointsRepository.save(any(TimePointsEntity.class))).thenAnswer(i -> i.getArguments()[0]);

    TimePointsEntity savedTimePointsEntity = timePointsClockInOutService.timePointsClockInOut(timePointsEntity, date);

    assertNotNull(savedTimePointsEntity);
    assertEquals(userId, savedTimePointsEntity.getUserId());
    verify(timePointsRepository, times(1)).save(timePointsEntity);
}
}