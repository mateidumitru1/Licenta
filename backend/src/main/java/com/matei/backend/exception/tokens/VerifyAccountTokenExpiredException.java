package com.matei.backend.exception.tokens;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value = HttpStatus.BAD_REQUEST, reason = "Verify account token expired")
public class VerifyAccountTokenExpiredException extends RuntimeException {
    public VerifyAccountTokenExpiredException(String message) {
        super(message);
    }
}
