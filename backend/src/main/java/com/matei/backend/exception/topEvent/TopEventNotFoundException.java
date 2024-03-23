package com.matei.backend.exception.topEvent;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(code = HttpStatus.NOT_FOUND, reason = "Top event not found")
public class TopEventNotFoundException extends RuntimeException{
    public TopEventNotFoundException(String message) {
        super(message);
    }
}
