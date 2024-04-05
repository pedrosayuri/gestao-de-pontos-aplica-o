package com.gestaodepontos.gestao_de_pontos.modules.login.services;

import java.time.Duration;
import java.time.Instant;

import javax.naming.AuthenticationException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.gestaodepontos.gestao_de_pontos.exceptions.CustomException;
import com.gestaodepontos.gestao_de_pontos.modules.login.dto.AuthUserDTO;
import com.gestaodepontos.gestao_de_pontos.modules.login.dto.AuthUserResponseDTO;
import com.gestaodepontos.gestao_de_pontos.modules.users.repositories.UserRepository;


@Service
public class LoginService {
    
    @Value("${security.token.secret}")
    private String secretKey;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public AuthUserResponseDTO authenticated(AuthUserDTO authUserDTO) throws AuthenticationException {
        var user = this.userRepository.findByEmail(authUserDTO.getEmail())
            .orElseThrow(() -> new CustomException(HttpStatus.UNAUTHORIZED.value(), "Email/Senha inválidos."));
        
        var passwordMatches = this.passwordEncoder.matches(authUserDTO.getPassword(), user.getPassword());

        if (!passwordMatches) {
            throw new CustomException(HttpStatus.UNAUTHORIZED.value(), "Email/Senha inválidos.");
        }

        var userRoles = "";

        if (user.getRoleId() == 1) {
            userRoles = "ADMIN";
        } else if (user.getRoleId() == 2) {
            userRoles = "COMUM";
        }

        Algorithm algorithm = Algorithm.HMAC256(secretKey);

        var expiresIn = Instant.now().plus(Duration.ofHours(24));

        var token = JWT.create()
            .withIssuer("gestaopontos")
            .withSubject(user.getId().toString())
            .withClaim("name", user.getUsername())
            .withClaim("email", user.getEmail())
            .withExpiresAt(java.util.Date.from(expiresIn))
            .withClaim("roles", userRoles)
            .sign(algorithm);

        var authUserResponseDTO = AuthUserResponseDTO.builder()
            .access_token(token)
            .build();

        return authUserResponseDTO; 

    }

}