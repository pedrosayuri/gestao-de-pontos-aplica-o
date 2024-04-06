package com.gestaodepontos.gestao_de_pontos.LoginTests;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.core.token.TokenService;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.gestaodepontos.gestao_de_pontos.exceptions.CustomException;
import com.gestaodepontos.gestao_de_pontos.modules.login.dto.AuthUserDTO;
import com.gestaodepontos.gestao_de_pontos.modules.login.services.LoginService;
import com.gestaodepontos.gestao_de_pontos.modules.users.entities.UserEntity;
import com.gestaodepontos.gestao_de_pontos.modules.users.repositories.UserRepository;

import java.util.Optional;

public class LoginServiceTest {

    @InjectMocks
    private LoginService loginService;

    @Mock
    private TokenService tokenService; 

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.openMocks(this);
        when(tokenService.verifyToken(anyString()));
    }

    @Test
    public void testAuthenticated() {
        UserEntity userEntity = new UserEntity();
        userEntity.setId(1L);
        userEntity.setEmail("testuser@test.com");
        userEntity.setPassword("testpassword");

        AuthUserDTO authUserDTO = new AuthUserDTO("testuser@test.com" , "testpassword");

        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(userEntity));
        when(passwordEncoder.matches(anyString(), anyString())).thenReturn(true);

        assertDoesNotThrow(() -> loginService.authenticated(authUserDTO));
    }

    @Test
    public void testAuthenticatedUserNotFound() {
        AuthUserDTO authUserDTO = new AuthUserDTO("testuser@test.com", "testpassword");

        when(userRepository.findByEmail(anyString())).thenReturn(Optional.empty());

        assertThrows(CustomException.class, () -> loginService.authenticated(authUserDTO));
    }

    @Test
    public void testAuthenticatedPasswordNotMatch() {
        UserEntity userEntity = new UserEntity();
        userEntity.setId(1L);
        userEntity.setEmail("testuser@test.com");
        userEntity.setPassword("testpassword");

        AuthUserDTO authUserDTO = new AuthUserDTO("testuser@test.com" , "wrongpassword");

        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(userEntity));
        when(passwordEncoder.matches(anyString(), anyString())).thenReturn(false);

        assertThrows(CustomException.class, () -> loginService.authenticated(authUserDTO));
    }
}
