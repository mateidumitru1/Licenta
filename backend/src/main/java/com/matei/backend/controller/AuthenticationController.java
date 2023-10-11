package com.matei.backend.controller;

import com.matei.backend.dto.request.AuthenticationRequestDto;
import com.matei.backend.dto.request.RegisterRequestDto;
import com.matei.backend.dto.response.AuthenticationResponseDto;
import com.matei.backend.dto.response.RegisterResponseDto;
import com.matei.backend.exception.UserAlreadyExistsException;
import com.matei.backend.service.AuthenticationService;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class AuthenticationController {

    private final AuthenticationService authenticationService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequestDto request) {
        try {
            return ResponseEntity.ok(authenticationService.register(request));
        } catch (UserAlreadyExistsException exception) {
            return new ResponseEntity<>(exception.getMessage(), HttpStatus.CONFLICT);
        }
    }

    @PostMapping("/authenticate")
    public ResponseEntity<AuthenticationResponseDto> authenticate(@RequestBody AuthenticationRequestDto request) {
        return ResponseEntity.ok(authenticationService.authenticate(request));
    }
}
