package com.gestaodepontos.gestao_de_pontos.modules.users.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.gestaodepontos.gestao_de_pontos.exceptions.MessageException;
import com.gestaodepontos.gestao_de_pontos.infra.RestMessageDTO;
import com.gestaodepontos.gestao_de_pontos.modules.users.services.ListUserService;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/users")
public class ListUserController {
    
    @Autowired
    private ListUserService listUserService;

    @GetMapping("/{id}")
    public ResponseEntity<Object> getUserById(@PathVariable("id") Long id, HttpServletRequest request) {
        try {
            var result = this.listUserService.getUserById(id);
            return ResponseEntity.ok().body(result);
        } catch (MessageException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            RestMessageDTO defaultErrorDTO = new RestMessageDTO(HttpStatus.BAD_REQUEST.value(), e.getMessage());
            return ResponseEntity.badRequest().body(defaultErrorDTO);
        }
    }
}
