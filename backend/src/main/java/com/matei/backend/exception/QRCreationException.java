package com.matei.backend.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(code = HttpStatus.INTERNAL_SERVER_ERROR, reason = "QR Creation Exception")
public class QRCreationException extends RuntimeException{
    public QRCreationException(String message) {
        super(message);
    }
}
