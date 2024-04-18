package com.matei.backend.exception.broadGenre;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value = HttpStatus.NOT_FOUND, reason = "Broad genre not found")
public class BroadGenreNotFoundException extends RuntimeException {
    public BroadGenreNotFoundException(String message) {
        super(message);
    }
}
