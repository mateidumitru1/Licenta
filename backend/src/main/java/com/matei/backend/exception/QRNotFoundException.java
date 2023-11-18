package com.matei.backend.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(code = HttpStatus.NOT_FOUND, reason = "QR not found")
public class QRNotFoundException extends RuntimeException{
    public QRNotFoundException(String message) {
        super(message);
    }
}
