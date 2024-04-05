package com.gestaodepontos.gestao_de_pontos.exceptions;

public class InvalidTokenException extends RuntimeException {

    public InvalidTokenException(String message) {
        super(message);
    }

    public String toJson() {
        return "{\"message\": \"" + getMessage() + "\"}";
    }
}