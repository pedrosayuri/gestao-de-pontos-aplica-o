package com.gestaodepontos.gestao_de_pontos.modules.users.controllers;

import java.net.URI;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.util.UriComponentsBuilder;

import com.gestaodepontos.gestao_de_pontos.infra.RestMessageDTO;
import com.gestaodepontos.gestao_de_pontos.modules.users.entities.UserEntity;
import com.gestaodepontos.gestao_de_pontos.modules.users.services.CreateUserService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/users")
public class CreateUserController {

    @Autowired
    private CreateUserService createUserService;

    @PostMapping("/")
    public ResponseEntity<Object> create(@Valid @RequestBody UserEntity userEntity, UriComponentsBuilder uriBuilder) {
        try {
            UserEntity createdUser = this.createUserService.create(userEntity);
            String uri = uriBuilder.path("/users/{id}").buildAndExpand(createdUser.getId()).toUriString();
            RestMessageDTO defaultMessageDTO = new RestMessageDTO(HttpStatus.CREATED.value(), "Usuário criado com sucesso");
            return ResponseEntity.created(new URI(uri)).body((defaultMessageDTO));
        } catch (Exception e) {
            RestMessageDTO defaultErrorDTO = new RestMessageDTO(HttpStatus.BAD_REQUEST.value(), e.getMessage());
            return ResponseEntity.badRequest().body(defaultErrorDTO);
        }
    }

}

