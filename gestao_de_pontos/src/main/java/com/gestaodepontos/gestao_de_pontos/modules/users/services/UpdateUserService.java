package com.gestaodepontos.gestao_de_pontos.modules.users.services;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.gestaodepontos.gestao_de_pontos.exceptions.MessageException;
import com.gestaodepontos.gestao_de_pontos.modules.users.entities.UserEntity;
import com.gestaodepontos.gestao_de_pontos.modules.users.repositories.UserRepository;

import jakarta.transaction.Transactional;

@Service
public class UpdateUserService {
    
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Transactional
    public UserEntity update(Long id, UserEntity updatedUser) {
        var user = userRepository.findById(id)
            .orElseThrow(() -> new MessageException("Usuário não encontrado"));

        boolean updated = false;

        if (updatedUser.getEmail() != null && !updatedUser.getEmail().equals(user.getEmail())) {
            checkIfEmailIsAvailable(updatedUser.getEmail(), id);
            user.setEmail(updatedUser.getEmail());
            updated = true;
        }

        if (updatedUser.getPassword() != null) {
            String encodedPassword = passwordEncoder.encode(updatedUser.getPassword());
            user.setPassword(encodedPassword);
            updated = true;
        }

        if (updated) {
            user.setModifiedAt(LocalDateTime.now());
        } else {
            throw new IllegalArgumentException("Nenhum campo de usuário atualizado");
        }

        return userRepository.save(user);
    }

    private void checkIfEmailIsAvailable(String email, Long id) {
        userRepository.findByEmailAndIdNot(email, id).ifPresent(existingUser -> {
            throw new IllegalArgumentException("Já existe um usuário com o email fornecido");
        });
    }
}
