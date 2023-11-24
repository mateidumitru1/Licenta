package com.matei.backend.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(code = HttpStatus.NOT_FOUND, reason = "Shopping cart not found")
public class ShoppingCartNotFoundException extends RuntimeException{
    ShoppingCartNotFoundException(String message) {
        super(message);
    }
}
