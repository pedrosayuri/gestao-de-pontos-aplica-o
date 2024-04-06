package com.gestaodepontos.gestao_de_pontos.UserTests;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import com.gestaodepontos.gestao_de_pontos.exceptions.MessageException;
import com.gestaodepontos.gestao_de_pontos.modules.users.entities.UserEntity;
import com.gestaodepontos.gestao_de_pontos.modules.users.repositories.UserRepository;
import com.gestaodepontos.gestao_de_pontos.modules.users.services.ListUserService;

import java.util.Optional;

public class ListUserServiceTest {

    @InjectMocks
    private ListUserService listUserService;

    @Mock
    private UserRepository userRepository;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testGetUserById() {
        UserEntity userEntity = new UserEntity();
        userEntity.setId(1L);
        userEntity.setUsername("testuser");

        when(userRepository.findById(anyLong())).thenReturn(Optional.of(userEntity));

        UserEntity foundUser = listUserService.getUserById(1L);

        assertEquals(1L, foundUser.getId());
        assertEquals("testuser", foundUser.getUsername());
    }

    @Test
    public void testGetUserByIdNotFound() {
        when(userRepository.findById(anyLong())).thenReturn(Optional.empty());

        assertThrows(MessageException.class, () -> listUserService.getUserById(1L));
    }
}