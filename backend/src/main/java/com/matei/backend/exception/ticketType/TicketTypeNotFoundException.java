package com.matei.backend.exception.ticketType;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(code = HttpStatus.NOT_FOUND, reason = "Ticket type not found")
public class TicketTypeNotFoundException extends RuntimeException{
    public TicketTypeNotFoundException(String message) {
        super(message);
    }
}
