package com.gestaodepontos.gestao_de_pontos.modules.users.dto;

import java.time.LocalDateTime;

import com.gestaodepontos.gestao_de_pontos.modules.users.enums.UserRegime;
import com.gestaodepontos.gestao_de_pontos.modules.users.enums.UserType;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserDTO {
    
    private Long id;
    private String email;
    private String username;
    private UserType UserRole;
    private UserRegime workRegime;
    private LocalDateTime createdAt;
}
