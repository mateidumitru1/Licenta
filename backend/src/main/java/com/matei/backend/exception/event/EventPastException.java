package com.matei.backend.exception.event;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(code = HttpStatus.BAD_REQUEST, reason = "Event is in the past!")
public class EventPastException extends RuntimeException{
    public EventPastException(String message) {
        super(message);
    }
}
