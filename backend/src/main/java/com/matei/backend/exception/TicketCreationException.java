package com.matei.backend.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(code = HttpStatus.INTERNAL_SERVER_ERROR, reason = "Ticket creation failed")
public class TicketCreationException extends RuntimeException{
    public TicketCreationException(String message) {
        super(message);
    }
}
