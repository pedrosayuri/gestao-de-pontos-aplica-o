package com.gestaodepontos.gestao_de_pontos.exceptions;

import com.gestaodepontos.gestao_de_pontos.infra.RestMessageDTO;

public class CustomException extends RuntimeException {
    private RestMessageDTO errorResponse;
    private int httpStatus;

    public CustomException(int httpStatus, String message) {
        super(message);
        this.httpStatus = httpStatus;
        this.errorResponse = new RestMessageDTO(httpStatus, message);
    }

    public RestMessageDTO getErrorResponse() {
        return this.errorResponse;
    }

    public int getHttpStatus() {
        return this.httpStatus;
    }
}