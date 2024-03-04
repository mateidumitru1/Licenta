package com.matei.backend.service;

import com.matei.backend.entity.ResetPasswordToken;
import com.matei.backend.entity.User;
import com.matei.backend.entity.VerifyAccountToken;
import com.matei.backend.exception.VerifyAccountTokenNotFoundException;
import com.matei.backend.repository.VerifyAccountTokenRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class VerifyAccountTokenService {
    private final VerifyAccountTokenRepository verifyAccountTokenRepository;

    public VerifyAccountToken save(VerifyAccountToken verifyAccountToken) {
        return verifyAccountTokenRepository.save(verifyAccountToken);
    }

    public VerifyAccountToken generateVerifyAccountToken(User user) {
        return verifyAccountTokenRepository.findByUser(user).orElse(VerifyAccountToken.builder()
                                .token(UUID.randomUUID().toString())
                                .user(user)
                                .expiration(getExpiration())
                                .build());
    }

    private LocalDateTime getExpiration() {
        return LocalDateTime.now().plusMinutes(60);
    }

    public VerifyAccountToken findByToken(String token) {
        return verifyAccountTokenRepository.findByToken(token)
                .orElseThrow(() -> new VerifyAccountTokenNotFoundException("Verify account token not found"));
    }

    public void delete(VerifyAccountToken verifyAccountToken) {
        verifyAccountTokenRepository.delete(verifyAccountToken);
    }

    public VerifyAccountToken findByUser(User user) {
        return verifyAccountTokenRepository.findByUser(user)
                .orElseThrow(() -> new VerifyAccountTokenNotFoundException("Verify account token not found"));
    }
}
