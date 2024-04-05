package com.gestaodepontos.gestao_de_pontos.modules.login.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthUserDTO {
    
    private String email;
    private String password;

}
