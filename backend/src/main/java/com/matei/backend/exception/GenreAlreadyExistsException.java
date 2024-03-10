package com.matei.backend.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(code = HttpStatus.CONFLICT, reason = "Genre already exists")
public class GenreAlreadyExistsException extends RuntimeException {
    public GenreAlreadyExistsException(String message) {
        super(message);
    }
}
