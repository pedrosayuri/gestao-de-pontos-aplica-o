package com.gestaodepontos.gestao_de_pontos.infra;

import java.util.ArrayList;
import java.util.List;

import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import com.gestaodepontos.gestao_de_pontos.exceptions.CustomException;
import com.gestaodepontos.gestao_de_pontos.exceptions.CustomTokenException;

@ControllerAdvice
public class ExceptionHandlerController {
    
    private MessageSource messageSource;

    public ExceptionHandlerController(MessageSource messageSource) {
        this.messageSource = messageSource;
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<List<ErrorInputMessageDTO>> handleMethodArgumentNotValidException(MethodArgumentNotValidException e) {
        List<ErrorInputMessageDTO> dto = new ArrayList<>();

        e.getBindingResult().getFieldErrors().forEach(err -> {
            String message = messageSource.getMessage(err, LocaleContextHolder.getLocale());
            ErrorInputMessageDTO error = new ErrorInputMessageDTO(message, err.getField());
            dto.add(error);
        });

        return new ResponseEntity<>(dto, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(CustomException.class)
    public static ResponseEntity<RestMessageDTO> handleCustomException(CustomException e) {
        int status = e.getErrorResponse().getStatus();
        RestMessageDTO messageException = new RestMessageDTO(status, e.getMessage());
        return ResponseEntity.status(status).body(messageException);
    }


    @ExceptionHandler(CustomTokenException.class)
    public ResponseEntity<ErrorResponse> handleCustomTokenException(CustomTokenException e) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getErrorResponse());
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<RestMessageDTO> handleAccessDeniedException(AccessDeniedException ex) {
        RestMessageDTO errorDTO = new RestMessageDTO(HttpStatus.FORBIDDEN.value(), "Você não tem essa permissão");
        return new ResponseEntity<>(errorDTO, HttpStatus.FORBIDDEN);
    }

}
