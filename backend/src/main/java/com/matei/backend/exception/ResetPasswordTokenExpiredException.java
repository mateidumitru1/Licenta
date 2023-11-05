package com.matei.backend.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value = HttpStatus.BAD_REQUEST, reason = "Reset password token expired")
public class ResetPasswordTokenExpiredException extends RuntimeException{
    public ResetPasswordTokenExpiredException(String message) {
        super(message);
    }
}
