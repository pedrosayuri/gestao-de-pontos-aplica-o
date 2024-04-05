package com.gestaodepontos.gestao_de_pontos.infra;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RestMessageDTO {
    
    private int status;
    private String message;

}
