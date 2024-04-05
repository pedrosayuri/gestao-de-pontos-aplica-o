package com.gestaodepontos.gestao_de_pontos.modules.login.controllers;

import javax.naming.AuthenticationException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.gestaodepontos.gestao_de_pontos.modules.login.dto.AuthUserDTO;
import com.gestaodepontos.gestao_de_pontos.modules.login.dto.AuthUserResponseDTO;
import com.gestaodepontos.gestao_de_pontos.modules.login.services.LoginService;

@RestController
@RequestMapping("/login")
public class LoginController {
    
    @Autowired
    private LoginService authUserService;

    @PostMapping("/")
    public ResponseEntity<Object> authenticate(@RequestBody AuthUserDTO authUserDTO) {
        try {
            AuthUserResponseDTO response = authUserService.authenticated(authUserDTO);
            return ResponseEntity.ok().body(response);
        } catch (AuthenticationException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        }
    }

}
