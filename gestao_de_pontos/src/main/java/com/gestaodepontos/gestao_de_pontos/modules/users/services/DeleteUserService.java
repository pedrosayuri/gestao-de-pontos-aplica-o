package com.gestaodepontos.gestao_de_pontos.modules.users.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.gestaodepontos.gestao_de_pontos.exceptions.MessageException;
import com.gestaodepontos.gestao_de_pontos.modules.users.repositories.UserRepository;

@Service
public class DeleteUserService {
    
    @Autowired
    private UserRepository userRepository;

    public void delete(Long id) {
        var user = this.userRepository.findById(id)
            .orElseThrow(() -> new MessageException("Usuário não encontrado"));
        
        this.userRepository.delete(user);
    }

}
