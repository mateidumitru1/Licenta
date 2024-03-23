package com.matei.backend.controller;

import com.matei.backend.exception.artist.ArtistAlreadyExistsException;
import com.matei.backend.exception.artist.ArtistNotFoundException;
import com.matei.backend.exception.auth.IncorrectOldPasswordException;
import com.matei.backend.exception.auth.InvalidCredentialsException;
import com.matei.backend.exception.auth.PasswordNotMatchingException;
import com.matei.backend.exception.event.EventNotFoundException;
import com.matei.backend.exception.event.EventPastException;
import com.matei.backend.exception.genre.GenreAlreadyExistsException;
import com.matei.backend.exception.genre.GenreNotFoundException;
import com.matei.backend.exception.location.LocationAlreadyExistsException;
import com.matei.backend.exception.location.LocationNotFoundException;
import com.matei.backend.exception.order.OrderNotFoundException;
import com.matei.backend.exception.resourceAccess.AdminResourceAccessException;
import com.matei.backend.exception.shoppingCart.ShoppingCartItemNotFoundException;
import com.matei.backend.exception.shoppingCart.ShoppingCartNotFoundException;
import com.matei.backend.exception.statistics.StatisticsFilterInvalidException;
import com.matei.backend.exception.ticket.TicketCreationException;
import com.matei.backend.exception.ticket.TicketNotFoundException;
import com.matei.backend.exception.ticketType.TicketTypeNotFoundException;
import com.matei.backend.exception.ticketType.TicketTypeQuantityException;
import com.matei.backend.exception.tokens.ResetPasswordTokenExpiredException;
import com.matei.backend.exception.tokens.ResetPasswordTokenNotFoundException;
import com.matei.backend.exception.tokens.VerifyAccountTokenExpiredException;
import com.matei.backend.exception.tokens.VerifyAccountTokenNotFoundException;
import com.matei.backend.exception.topEvent.TopEventAlreadyExistsException;
import com.matei.backend.exception.topEvent.TopEventNotFoundException;
import com.matei.backend.exception.user.UserAlreadyEnabledException;
import com.matei.backend.exception.user.UserAlreadyExistsException;
import com.matei.backend.exception.user.UserNotEnabledException;
import com.matei.backend.exception.user.UserNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class ExceptionHandlerController {

    @ExceptionHandler(AdminResourceAccessException.class)
    public ResponseEntity<?> handleAdminResourceAccessException(AdminResourceAccessException exception) {
        return new ResponseEntity<>(exception.getMessage(), HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler(ArtistAlreadyExistsException.class)
    public ResponseEntity<?> handleArtistAlreadyExistsException(ArtistAlreadyExistsException exception) {
        return new ResponseEntity<>(exception.getMessage(), HttpStatus.CONFLICT);
    }

    @ExceptionHandler(ArtistNotFoundException.class)
    public ResponseEntity<?> handleArtistNotFoundException(ArtistNotFoundException exception) {
        return new ResponseEntity<>(exception.getMessage(), HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(GenreNotFoundException.class)
    public ResponseEntity<?> handleGenreNotFoundException(GenreNotFoundException exception) {
        return new ResponseEntity<>(exception.getMessage(), HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(GenreAlreadyExistsException.class)
    public ResponseEntity<?> handleGenreAlreadyExistsException(GenreAlreadyExistsException exception) {
        return new ResponseEntity<>(exception.getMessage(), HttpStatus.CONFLICT);
    }

    @ExceptionHandler(EventNotFoundException.class)
    public ResponseEntity<?> handleEventNotFoundException(EventNotFoundException exception) {
        return new ResponseEntity<>(exception.getMessage(), HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(EventPastException.class)
    public ResponseEntity<?> handleEventPastException(EventPastException exception) {
        return new ResponseEntity<>(exception.getMessage(), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(InvalidCredentialsException.class)
    public ResponseEntity<?> handleInvalidCredentialsException(InvalidCredentialsException exception) {
        return new ResponseEntity<>(exception.getMessage(), HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(UserNotEnabledException.class)
    public ResponseEntity<?> handleUserNotEnabledException(UserNotEnabledException exception) {
        return new ResponseEntity<>(exception.getMessage(), HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(LocationAlreadyExistsException.class)
    public ResponseEntity<?> handleLocationAlreadyExistsException(LocationAlreadyExistsException exception) {
        return new ResponseEntity<>(exception.getMessage(), HttpStatus.CONFLICT);
    }

    @ExceptionHandler(LocationNotFoundException.class)
    public ResponseEntity<?> handleLocationNotFoundException(LocationNotFoundException exception) {
        return new ResponseEntity<>(exception.getMessage(), HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(OrderNotFoundException.class)
    public ResponseEntity<?> handleOrderNotFoundException(OrderNotFoundException exception) {
        return new ResponseEntity<>(exception.getMessage(), HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(TicketCreationException.class)
    public ResponseEntity<?> handleQRCreationException(TicketCreationException exception) {
        return new ResponseEntity<>(exception.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
    }

    @ExceptionHandler(ResetPasswordTokenExpiredException.class)
    public ResponseEntity<?> handleResetPasswordTokenExpiredException(ResetPasswordTokenExpiredException exception) {
        return new ResponseEntity<>(exception.getMessage(), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(ResetPasswordTokenNotFoundException.class)
    public ResponseEntity<?> handleResetPasswordTokenNotFoundException(ResetPasswordTokenNotFoundException exception) {
        return new ResponseEntity<>(exception.getMessage(), HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(VerifyAccountTokenExpiredException.class)
    public ResponseEntity<?> handleVerifyAccountTokenExpiredException(VerifyAccountTokenExpiredException exception) {
        return new ResponseEntity<>(exception.getMessage(), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(VerifyAccountTokenNotFoundException.class)
    public ResponseEntity<?> handleVerifyAccountTokenNotFoundException(VerifyAccountTokenNotFoundException exception) {
        return new ResponseEntity<>(exception.getMessage(), HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(UserAlreadyEnabledException.class)
    public ResponseEntity<?> handleUserAlreadyEnabledException(UserAlreadyEnabledException exception) {
        return new ResponseEntity<>(exception.getMessage(), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(ShoppingCartItemNotFoundException.class)
    public ResponseEntity<?> handleShoppingCartItemNotFoundException(ShoppingCartItemNotFoundException exception) {
        return new ResponseEntity<>(exception.getMessage(), HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(ShoppingCartNotFoundException.class)
    public ResponseEntity<?> handleShoppingCartNotFoundException(ShoppingCartNotFoundException exception) {
        return new ResponseEntity<>(exception.getMessage(), HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(TicketNotFoundException.class)
    public ResponseEntity<?> handleTicketNotFoundException(TicketNotFoundException exception) {
        return new ResponseEntity<>(exception.getMessage(), HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(TicketTypeNotFoundException.class)
    public ResponseEntity<?> handleTicketTypeNotFoundException(TicketTypeNotFoundException exception) {
        return new ResponseEntity<>(exception.getMessage(), HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(TicketTypeQuantityException.class)
    public ResponseEntity<?> handleTicketTypeQuantityException(TicketTypeQuantityException exception) {
        return new ResponseEntity<>(exception.getMessage(), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(TopEventAlreadyExistsException.class)
    public ResponseEntity<?> handleTopEventAlreadyExistsException(TopEventAlreadyExistsException exception) {
        return new ResponseEntity<>(exception.getMessage(), HttpStatus.CONFLICT);
    }

    @ExceptionHandler(TopEventNotFoundException.class)
    public ResponseEntity<?> handleTopEventNotFoundException(TopEventNotFoundException exception) {
        return new ResponseEntity<>(exception.getMessage(), HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(UserAlreadyExistsException.class)
    public ResponseEntity<?> handleUserAlreadyExistsException(UserAlreadyExistsException exception) {
        return new ResponseEntity<>(exception.getMessage(), HttpStatus.CONFLICT);
    }

    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<?> handleUserNotFoundException(UserNotFoundException exception) {
        return new ResponseEntity<>(exception.getMessage(), HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(IncorrectOldPasswordException.class)
    public ResponseEntity<?> handleIncorrectOldPasswordException(IncorrectOldPasswordException exception) {
        return new ResponseEntity<>(exception.getMessage(), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(PasswordNotMatchingException.class)
    public ResponseEntity<?> handlePasswordNotMatchingException(PasswordNotMatchingException exception) {
        return new ResponseEntity<>(exception.getMessage(), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(StatisticsFilterInvalidException.class)
    public ResponseEntity<?> handleStatisticsFilterNotFoundException(StatisticsFilterInvalidException exception) {
        return new ResponseEntity<>(exception.getMessage(), HttpStatus.BAD_REQUEST);
    }
}
