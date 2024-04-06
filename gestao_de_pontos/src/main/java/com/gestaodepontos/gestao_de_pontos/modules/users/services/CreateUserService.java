package com.gestaodepontos.gestao_de_pontos.modules.users.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.gestaodepontos.gestao_de_pontos.exceptions.MessageException;
import com.gestaodepontos.gestao_de_pontos.modules.users.entities.UserEntity;
import com.gestaodepontos.gestao_de_pontos.modules.users.enums.UserType;
import com.gestaodepontos.gestao_de_pontos.modules.users.repositories.UserRepository;

@Service
public class CreateUserService {
    
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public UserEntity create(UserEntity userEntity) {
        validateUserData(userEntity);
        return this.userRepository.save(userEntity);
    }

    private void validateUserData(UserEntity userEntity) {
        var password = passwordEncoder.encode(userEntity.getPassword());
        userEntity.setPassword(password);

        validateUserDoesNotExist(userEntity.getEmail());
        validateUserNameLength(userEntity.getUsername());
        validateUserRole(userEntity.getUserRole());
    }

    private void validateUserDoesNotExist( String email) {
        if (userRepository.findByEmail(email).isPresent()) {
            throw new MessageException("Usuário já existe com esse e-mail");
        }
    }

    private void validateUserNameLength(String name) {
        if (name.length() < 3) {
            throw new MessageException("O nome do usuário deve ter pelo menos 3 caracteres");
        }
    }

    private void validateUserRole(UserType userType) {
        if (userType != UserType.ADMIN && userType != UserType.COMUM) {
            throw new MessageException("Tipo de usuário inválido");
        }
    }
    
}
