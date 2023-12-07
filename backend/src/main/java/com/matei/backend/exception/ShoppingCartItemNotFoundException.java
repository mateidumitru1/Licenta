package com.matei.backend.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(code = HttpStatus.NOT_FOUND, reason = "Shopping cart item not found")
public class ShoppingCartItemNotFoundException extends RuntimeException {
    public ShoppingCartItemNotFoundException(String message) {
        super(message);
    }
}
