package com.matei.backend.exception.tokens;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value = HttpStatus.NOT_FOUND, reason = "Reset password token not found")
public class ResetPasswordTokenNotFoundException extends RuntimeException{
    public ResetPasswordTokenNotFoundException(String message) {
        super(message);
    }
}
