package com.gestaodepontos.gestao_de_pontos.modules.login.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthUserResponseDTO {
    
    // private String expires_in;
    private String access_token;

}
