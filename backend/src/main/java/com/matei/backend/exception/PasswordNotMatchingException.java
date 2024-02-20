package com.matei.backend.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(code = HttpStatus.BAD_REQUEST, reason = "Password not matching")
public class PasswordNotMatchingException extends RuntimeException{
    public PasswordNotMatchingException(String message) {
        super(message);
    }
}
