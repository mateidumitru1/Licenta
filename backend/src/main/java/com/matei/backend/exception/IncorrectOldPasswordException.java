package com.matei.backend.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(code = HttpStatus.BAD_REQUEST, reason = "Incorrect old password")
public class IncorrectOldPasswordException extends RuntimeException{
    public IncorrectOldPasswordException(String message) {
        super(message);
    }
}
