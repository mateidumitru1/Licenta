package com.matei.backend.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(code = HttpStatus.NOT_FOUND, reason = "Verify account token not found")
public class VerifyAccountTokenNotFoundException extends RuntimeException {
    public VerifyAccountTokenNotFoundException(String message) {
        super(message);
    }
}
