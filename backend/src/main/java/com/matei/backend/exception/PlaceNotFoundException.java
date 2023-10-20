package com.matei.backend.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value = HttpStatus.NOT_FOUND, reason = "Place not found")
public class PlaceNotFoundException extends RuntimeException {
    public PlaceNotFoundException(String message) {
        super(message);
    }
}
