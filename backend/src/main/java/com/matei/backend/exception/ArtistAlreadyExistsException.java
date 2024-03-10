package com.matei.backend.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(code = HttpStatus.CONFLICT, reason = "Artist already exists")
public class ArtistAlreadyExistsException extends RuntimeException{
    public ArtistAlreadyExistsException(String message) {
        super(message);
    }
}
