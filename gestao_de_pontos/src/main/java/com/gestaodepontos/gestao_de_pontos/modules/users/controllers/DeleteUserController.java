package com.gestaodepontos.gestao_de_pontos.modules.users.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.gestaodepontos.gestao_de_pontos.exceptions.MessageException;
import com.gestaodepontos.gestao_de_pontos.infra.RestMessageDTO;
import com.gestaodepontos.gestao_de_pontos.modules.users.services.DeleteUserService;

import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/users")
public class DeleteUserController {
    
    @Autowired
    private DeleteUserService deleteUserService;

    @DeleteMapping("/{id}")
    public ResponseEntity<Object> delete(@PathVariable("id") Long id, HttpServletRequest request) {
        try {
            String userID = (String) request.getAttribute("user_id");
            String idString = id.toString();

            if (!userID.equals(idString)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(new RestMessageDTO(HttpStatus.FORBIDDEN.value(), "Você não tem essa permissão"));
            }

            this.deleteUserService.delete(id);
            return ResponseEntity.ok().build();
        } catch (MessageException e) {
            return ResponseEntity.notFound().build();
        } catch (Exception e) {
            RestMessageDTO defaultErrorDTO = new RestMessageDTO(HttpStatus.BAD_REQUEST.value(), e.getMessage());
            return ResponseEntity.badRequest().body(defaultErrorDTO);
        }
    }

}
