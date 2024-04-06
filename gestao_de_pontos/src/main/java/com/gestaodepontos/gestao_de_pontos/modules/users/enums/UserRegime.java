package com.gestaodepontos.gestao_de_pontos.modules.users.enums;

import com.gestaodepontos.gestao_de_pontos.exceptions.MessageException;

public enum UserRegime {
    SEIS_HORAS,
    OITO_HORAS;

    public static UserRegime fromString(String regime) {
        switch (regime) {
            case "SEIS_HORAS":
                return SEIS_HORAS;
            case "OITO_HORAS":
                return OITO_HORAS;
            default:
                throw new MessageException("Tipo de regime inválido");
        }
    }
}
