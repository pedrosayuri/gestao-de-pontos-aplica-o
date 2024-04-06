package com.gestaodepontos.gestao_de_pontos.UserTests;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.gestaodepontos.gestao_de_pontos.exceptions.MessageException;
import com.gestaodepontos.gestao_de_pontos.modules.users.entities.UserEntity;
import com.gestaodepontos.gestao_de_pontos.modules.users.repositories.UserRepository;
import com.gestaodepontos.gestao_de_pontos.modules.users.services.UpdateUserService;

import java.util.Optional;

public class UpdateUserServiceTest {

    @InjectMocks
    private UpdateUserService updateUserService;

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testUpdateUser() {
        UserEntity existingUser = new UserEntity();
        existingUser.setId(1L);
        existingUser.setEmail("oldemail@test.com");
        existingUser.setPassword("oldpassword");

        UserEntity updatedUser = new UserEntity();
        updatedUser.setEmail("newemail@test.com");
        updatedUser.setPassword("newpassword");

        when(userRepository.findById(anyLong())).thenReturn(Optional.of(existingUser));
        when(userRepository.findByEmailAndIdNot(anyString(), anyLong())).thenReturn(Optional.empty());
        when(passwordEncoder.encode(anyString())).thenReturn("encodedpassword");
        when(userRepository.save(any(UserEntity.class))).thenAnswer(i -> i.getArguments()[0]);

        UserEntity result = updateUserService.update(1L, updatedUser);

        assertNotNull(result, "Result should not be null");
        assertEquals("newemail@test.com", result.getEmail());
        assertEquals("encodedpassword", result.getPassword());
        assertNotNull(result.getModifiedAt());
    }

    @Test
    public void testUpdateUserNotFound() {
        UserEntity updatedUser = new UserEntity();
        updatedUser.setEmail("newemail@test.com");
        updatedUser.setPassword("newpassword");

        when(userRepository.findById(anyLong())).thenReturn(Optional.empty());

        assertThrows(MessageException.class, () -> updateUserService.update(1L, updatedUser));
    }

    @Test
    public void testUpdateUserEmailAlreadyExists() {
        UserEntity existingUser = new UserEntity();
        existingUser.setId(1L);
        existingUser.setEmail("oldemail@test.com");
        existingUser.setPassword("oldpassword");

        UserEntity updatedUser = new UserEntity();
        updatedUser.setEmail("newemail@test.com");
        updatedUser.setPassword("newpassword");

        when(userRepository.findById(anyLong())).thenReturn(Optional.of(existingUser));
        when(userRepository.findByEmailAndIdNot(anyString(), anyLong())).thenReturn(Optional.of(existingUser));

        assertThrows(IllegalArgumentException.class, () -> updateUserService.update(1L, updatedUser));
    }
}