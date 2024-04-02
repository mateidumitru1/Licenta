package com.matei.backend.controller;

import com.matei.backend.dto.request.auth.AuthenticationRequestDto;
import com.matei.backend.dto.request.auth.RegisterRequestDto;
import com.matei.backend.service.auth.AuthenticationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class AuthenticationController {

    private final AuthenticationService authenticationService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequestDto request) {
        return ResponseEntity.ok(authenticationService.register(request));
    }

    @PostMapping("/authenticate")
    public ResponseEntity<?> authenticate(@RequestBody AuthenticationRequestDto request) throws Exception {
        return ResponseEntity.ok(authenticationService.authenticate(request));
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(@RequestHeader("Authorization") String token) {
        authenticationService.logout(token);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<Void> forgotPassword(@RequestParam("email") String email) {
        authenticationService.forgotPassword(email);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestParam("token") String token, @RequestParam("password") String password) {
        authenticationService.resetPassword(token, password);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/verify-account")
    public ResponseEntity<?> verifyAccount(@RequestParam("token") String token) {
        authenticationService.verifyAccount(token);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/resend-verify-account-email")
    public ResponseEntity<?> resendVerifyAccountEmail(@RequestParam("email") String email) {
        authenticationService.resendVerifyAccountEmail(email);
        return ResponseEntity.ok().build();
    }
}
