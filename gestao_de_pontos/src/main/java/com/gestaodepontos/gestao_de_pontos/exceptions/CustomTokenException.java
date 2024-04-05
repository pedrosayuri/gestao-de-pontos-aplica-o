package com.gestaodepontos.gestao_de_pontos.exceptions;

import com.gestaodepontos.gestao_de_pontos.infra.ErrorResponse;

public class CustomTokenException extends RuntimeException {
    private ErrorResponse errorResponse;

    public CustomTokenException(String message) {
        super(message);
        this.errorResponse = new ErrorResponse(message);
    }

    public ErrorResponse getErrorResponse() {
        return this.errorResponse;
    }
}