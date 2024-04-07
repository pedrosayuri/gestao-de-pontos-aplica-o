package com.gestaodepontos.gestao_de_pontos.modules.users.services;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.gestaodepontos.gestao_de_pontos.modules.users.dto.UserDTO;
import com.gestaodepontos.gestao_de_pontos.modules.users.repositories.UserRepository;

@Service
public class ListAllUserService {
    
    @Autowired
    private UserRepository userRepository;

        public List<UserDTO> getAllUsers() {
        return userRepository.findAll().stream()
                .map(user -> new UserDTO(user.getId(), user.getEmail(), user.getUsername(), user.getUserRole(), user.getWorkRegime(), user.getCreatedAt()))
                .collect(Collectors.toList());
    }
}
