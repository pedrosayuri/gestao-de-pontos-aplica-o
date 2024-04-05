package com.gestaodepontos.gestao_de_pontos.infra;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class ErrorInputMessageDTO {
    
    private String message;
    private String field;

}
