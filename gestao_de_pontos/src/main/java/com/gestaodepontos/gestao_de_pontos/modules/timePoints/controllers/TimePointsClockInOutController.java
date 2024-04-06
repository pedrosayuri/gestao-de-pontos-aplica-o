package com.gestaodepontos.gestao_de_pontos.modules.timePoints.controllers;

import java.time.LocalDate;
import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.gestaodepontos.gestao_de_pontos.infra.RestMessageDTO;
import com.gestaodepontos.gestao_de_pontos.modules.timePoints.entities.TimePointsEntity;
import com.gestaodepontos.gestao_de_pontos.modules.timePoints.services.TimePointsClockInOutService;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/time-points")
public class TimePointsClockInOutController {
    
    @Autowired
    private TimePointsClockInOutService timePointsClockInOutServices;

    @PostMapping("/")
    @PreAuthorize("hasRole('ADMIN') or hasRole('COMUM')")
    public ResponseEntity<Object> timePointsClockInOut(@RequestBody TimePointsEntity createTimePointsEntity, HttpServletRequest request) {
        try {
            var userId = request.getAttribute("user_id");

            if (userId == null) {
                RestMessageDTO defaultErrorDTO = new RestMessageDTO(HttpStatus.BAD_REQUEST.value(), "Usuário não encontrado");
                return ResponseEntity.badRequest().body(defaultErrorDTO);
            }

            LocalDateTime timestampTimePoints = createTimePointsEntity.getTimestamp() != null ? createTimePointsEntity.getTimestamp() : LocalDateTime.now();
            LocalDate timestampTimePointsLocalDate = timestampTimePoints.toLocalDate();

            var timePointsEntity = TimePointsEntity.builder()
                .userId(Long.parseLong(userId.toString()))
                .timestamp(timestampTimePoints)
                .reasons(createTimePointsEntity.getReasons())
                .build();

            TimePointsEntity result = this.timePointsClockInOutServices.timePointsClockInOut(timePointsEntity, timestampTimePointsLocalDate);

            return ResponseEntity.ok().body(result);
        } catch (Exception e) {
            RestMessageDTO defaultErrorDTO = new RestMessageDTO(HttpStatus.BAD_REQUEST.value(), e.getMessage());
            return ResponseEntity.badRequest().body(defaultErrorDTO);
        }
    }

}
