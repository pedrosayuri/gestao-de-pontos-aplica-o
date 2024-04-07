package com.gestaodepontos.gestao_de_pontos.modules.users.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.gestaodepontos.gestao_de_pontos.infra.RestMessageDTO;
import com.gestaodepontos.gestao_de_pontos.modules.users.dto.UserDTO;
import com.gestaodepontos.gestao_de_pontos.modules.users.services.ListAllUserService;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/users")
public class ListAllUserController {
    
    @Autowired
    private ListAllUserService listAllUserService;

    @GetMapping("/")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Object> getAllUsers(HttpServletRequest request) {
        try {
            List<UserDTO> result = this.listAllUserService.getAllUsers();
            return ResponseEntity.ok().body(result);
        } catch (Exception e) {
            RestMessageDTO defaultErrorDTO = new RestMessageDTO(HttpStatus.BAD_REQUEST.value(), e.getMessage());
            return ResponseEntity.badRequest().body(defaultErrorDTO);
        }
    }

}
