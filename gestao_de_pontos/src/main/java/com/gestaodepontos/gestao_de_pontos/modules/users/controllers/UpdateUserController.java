package com.gestaodepontos.gestao_de_pontos.modules.users.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.gestaodepontos.gestao_de_pontos.exceptions.MessageException;
import com.gestaodepontos.gestao_de_pontos.infra.RestMessageDTO;
import com.gestaodepontos.gestao_de_pontos.modules.users.entities.UserEntity;
import com.gestaodepontos.gestao_de_pontos.modules.users.services.UpdateUserService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/users")
@PreAuthorize("hasRole('ADMIN')")
public class UpdateUserController {
    
    @Autowired
    private UpdateUserService updateUserService;

    @PutMapping("/{id}")
    public ResponseEntity<Object> update(@PathVariable("id") Long id, @Valid @RequestBody UserEntity userEntity, HttpServletRequest request) {
        try {
            String userID = (String) request.getAttribute("user_id");
            if (userID == null || id == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(new RestMessageDTO(HttpStatus.UNAUTHORIZED.value(), "Usuário não autenticado"));
            }

            if (!userID.equals(String.valueOf(id))) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(new RestMessageDTO(HttpStatus.FORBIDDEN.value(), "Você não tem essa permissão"));
            }

            var result =  this.updateUserService.update(id, userEntity);
            return ResponseEntity.ok().body(result);
        } catch (MessageException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            RestMessageDTO defaultErrorDTO = new RestMessageDTO(HttpStatus.BAD_REQUEST.value(), e.getMessage());
            return ResponseEntity.badRequest().body(defaultErrorDTO);
        }
    }

}
