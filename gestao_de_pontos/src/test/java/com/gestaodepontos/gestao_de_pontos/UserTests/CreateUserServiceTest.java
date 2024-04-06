package com.gestaodepontos.gestao_de_pontos.UserTests;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.gestaodepontos.gestao_de_pontos.exceptions.MessageException;
import com.gestaodepontos.gestao_de_pontos.modules.users.entities.UserEntity;
import com.gestaodepontos.gestao_de_pontos.modules.users.enums.UserType;
import com.gestaodepontos.gestao_de_pontos.modules.users.repositories.UserRepository;
import com.gestaodepontos.gestao_de_pontos.modules.users.services.CreateUserService;

import java.util.Optional;

public class CreateUserServiceTest {

    @InjectMocks
    private CreateUserService createUserService;

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testCreateUser() {
        UserEntity userEntity = new UserEntity();
        userEntity.setEmail("test@test.com");
        userEntity.setUsername("testuser");
        userEntity.setPassword("password");
        userEntity.setUserRole(UserType.ADMIN);

        when(userRepository.findByEmail(anyString())).thenReturn(Optional.empty());
        when(passwordEncoder.encode(anyString())).thenReturn("encodedPassword");
        when(userRepository.save(any(UserEntity.class))).thenReturn(userEntity);

        UserEntity createdUser = createUserService.create(userEntity);

        assertEquals("test@test.com", createdUser.getEmail());
        assertEquals("testuser", createdUser.getUsername());
        assertEquals("encodedPassword", createdUser.getPassword());
        assertEquals(UserType.ADMIN, createdUser.getUserRole());
    }

    @Test
    public void testCreateUserWithExistingEmail() {
        UserEntity userEntity = new UserEntity();
        userEntity.setEmail("test@test.com");

        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(userEntity));

        assertThrows(MessageException.class, () -> createUserService.create(userEntity));
    }
}