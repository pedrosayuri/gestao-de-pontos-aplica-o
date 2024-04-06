package com.gestaodepontos.gestao_de_pontos.modules.timePoints.respositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.gestaodepontos.gestao_de_pontos.modules.timePoints.entities.TimePointsEntity;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface TimePointsRepository extends JpaRepository<TimePointsEntity, Long> {
    Optional<TimePointsEntity> findById(Long id);

    @Query("SELECT tp FROM TimePoints tp WHERE tp.userId = :userId AND DATE(tp.timestamp) = :timestamp")
    List<TimePointsEntity> findByUserIdAndTimestamp(Long userId, LocalDate timestamp);

    @Query("SELECT COUNT(tp) FROM TimePoints tp WHERE tp.userId = :userId AND DATE(tp.timestamp) = :timestamp")
    int countByUserIdAndTimestamp(@Param("userId") Long userId, @Param("timestamp") LocalDate timestamp);

    @Query(value = "SELECT TO_CHAR((EXTRACT(EPOCH FROM MAX(tp.timestamp) - MIN(tp.timestamp)) * INTERVAL '1 SECOND'), 'HH24:MI:SS') AS workedHoursInADay FROM time_points tp WHERE tp.user_id = :userId AND DATE(tp.timestamp) = :timestamp", nativeQuery = true)
    String getWorkedHoursInADay(@Param("userId") Long userId, @Param("timestamp") LocalDate timestamp);
}
