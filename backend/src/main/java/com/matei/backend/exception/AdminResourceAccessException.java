package com.matei.backend.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(code = HttpStatus.FORBIDDEN, reason = "You are not authorized to perform this action")
public class AdminResourceAccessException extends RuntimeException {
    public AdminResourceAccessException(String message) {
        super(message);
    }
}
