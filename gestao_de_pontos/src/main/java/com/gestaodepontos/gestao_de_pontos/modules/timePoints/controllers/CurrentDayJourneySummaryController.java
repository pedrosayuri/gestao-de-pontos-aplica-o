package com.gestaodepontos.gestao_de_pontos.modules.timePoints.controllers;

import java.time.LocalDate;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.gestaodepontos.gestao_de_pontos.infra.RestMessageDTO;
import com.gestaodepontos.gestao_de_pontos.modules.timePoints.services.CurrentDayJourneySummaryService;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/current-day-journey-summary")
public class CurrentDayJourneySummaryController {
    
    @Autowired
    private CurrentDayJourneySummaryService currentDayJourneySummaryService;

    @GetMapping("")
    public ResponseEntity<Object> getPointsByDay(@RequestParam String userIdStr, @RequestParam String dateStr, HttpServletRequest request) {
        try {
            long userId = Long.parseLong(userIdStr);        
                        
            LocalDate dateTime = LocalDate.parse(dateStr);

            var requestUserId = request.getAttribute("user_id");

            if (requestUserId == null || !(requestUserId.toString().equals(userIdStr)) && !request.isUserInRole("ADMIN")) {
                RestMessageDTO defaultErrorDTO = new RestMessageDTO(HttpStatus.BAD_REQUEST.value(), "Você não tem essa permissão!");
                return ResponseEntity.badRequest().body(defaultErrorDTO);
            }

            var result = this.currentDayJourneySummaryService.getPointsByDay(userId, dateTime);

            if (result.isEmpty()) {
                RestMessageDTO defaultErrorDTO = new RestMessageDTO(HttpStatus.BAD_REQUEST.value(), "Jornada do dia não iniciada.");
                return ResponseEntity.badRequest().body(defaultErrorDTO);
            }

            return ResponseEntity.ok().body(result);
        } catch (Exception e) {
            if (e.getMessage().equals("text")) {
                RestMessageDTO defaultErrorDTO = new RestMessageDTO(HttpStatus.BAD_REQUEST.value(), "Jornada do dia não iniciada.");
                return ResponseEntity.badRequest().body(defaultErrorDTO);
            }

            RestMessageDTO defaultErrorDTO = new RestMessageDTO(HttpStatus.BAD_REQUEST.value(), e.getMessage());
            return ResponseEntity.badRequest().body(defaultErrorDTO);
        }
    }


}
