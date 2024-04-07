package com.gestaodepontos.gestao_de_pontos.UserTests;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import com.gestaodepontos.gestao_de_pontos.modules.users.dto.UserDTO;
import com.gestaodepontos.gestao_de_pontos.modules.users.entities.UserEntity;
import com.gestaodepontos.gestao_de_pontos.modules.users.repositories.UserRepository;
import com.gestaodepontos.gestao_de_pontos.modules.users.services.ListAllUserService;

import java.util.Arrays;
import java.util.List;

public class ListAllUserServiceTest {

    @InjectMocks
    private ListAllUserService listAllUserService;

    @Mock
    private UserRepository userRepository;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testGetAllUsers() {
        UserEntity user1 = new UserEntity();
        user1.setId(1L);
        user1.setUsername("user1");

        UserEntity user2 = new UserEntity();
        user2.setId(2L);
        user2.setUsername("user2");

        when(userRepository.findAll()).thenReturn(Arrays.asList(user1, user2));

        List<UserDTO> users = listAllUserService.getAllUsers();

        assertEquals(2, users.size());
        assertEquals("user1", users.get(0).getUsername());
        assertEquals("user2", users.get(1).getUsername());
    }
}