package com.matei.backend.exception.ticketType;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(code = HttpStatus.BAD_REQUEST, reason = "Ticket type quantity is invalid")
public class TicketTypeQuantityException extends RuntimeException {
    public TicketTypeQuantityException(String message) {
        super(message);
    }
}
