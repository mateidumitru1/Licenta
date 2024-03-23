package com.matei.backend.exception.statistics;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(code = HttpStatus.BAD_REQUEST, reason = "Statistics filter not found")
public class StatisticsFilterInvalidException extends RuntimeException {
    public StatisticsFilterInvalidException(String message) {
        super(message);
    }
}
