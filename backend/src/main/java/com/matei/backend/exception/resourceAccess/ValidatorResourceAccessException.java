package com.matei.backend.exception.resourceAccess;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(code = HttpStatus.FORBIDDEN, reason = "You are not authorized to perform this action")
public class ValidatorResourceAccessException extends RuntimeException{
    public ValidatorResourceAccessException(String message) {
        super(message);
    }
}
