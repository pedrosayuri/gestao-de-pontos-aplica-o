package com.gestaodepontos.gestao_de_pontos.modules.users.enums;

import com.gestaodepontos.gestao_de_pontos.exceptions.MessageException;

public enum UserType {
    ADMIN,
    COMUM;

    public static UserType fromString(String type) {
        switch (type) {
            case "COMUM":
                return COMUM;
            case "ADMIN":
                return ADMIN;
            default:
                throw new MessageException("Tipo de usuário inválido");
        }
    }
}
