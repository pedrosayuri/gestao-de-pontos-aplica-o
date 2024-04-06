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
import com.gestaodepontos.gestao_de_pontos.modules.users.services.DeleteUserService;

import java.util.Optional;

public class DeleteUserServiceTest {

    @InjectMocks
    private DeleteUserService deleteUserService;

    @Mock
    private UserRepository userRepository;

    @BeforeEach
    public void setup() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    public void testDeleteUser() {
        UserEntity userEntity = new UserEntity();
        userEntity.setId(3L);

        when(userRepository.findById(anyLong())).thenReturn(Optional.of(userEntity));

        deleteUserService.delete(3L);

        verify(userRepository, times(1)).delete(userEntity);
    }

    @Test
    public void testDeleteUserNotFound() {
        when(userRepository.findById(anyLong())).thenReturn(Optional.empty());

        assertThrows(MessageException.class, () -> deleteUserService.delete(3L));
    }
}