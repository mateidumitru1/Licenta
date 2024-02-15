package com.matei.backend.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(code = HttpStatus.CONFLICT, reason = "Top event already exists")
public class TopEventAlreadyExistsException extends RuntimeException{
    public TopEventAlreadyExistsException(String message) {
        super(message);
    }
}
