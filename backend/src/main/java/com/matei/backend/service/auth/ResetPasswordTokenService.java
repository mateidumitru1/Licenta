package com.matei.backend.service.auth;

import com.matei.backend.entity.ResetPasswordToken;
import com.matei.backend.entity.User;
import com.matei.backend.exception.tokens.ResetPasswordTokenNotFoundException;
import com.matei.backend.repository.ResetPasswordTokenRespository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.UUID;

@RequiredArgsConstructor
@Service
public class ResetPasswordTokenService {
    private final ResetPasswordTokenRespository resetPasswordTokenRepository;

    public ResetPasswordToken save(ResetPasswordToken resetPasswordToken) {
        return resetPasswordTokenRepository.save(resetPasswordToken);
    }

    public ResetPasswordToken generateResetPasswordToken(User user) {
        return resetPasswordTokenRepository.findByUser(user).orElse(ResetPasswordToken.builder()
                                .token(UUID.randomUUID().toString())
                                .createdAt(LocalDateTime.now())
                                .user(user)
                                .expiration(getExpiration())
                                .build());
    }

    private LocalDateTime getExpiration() {
        return LocalDateTime.now().plusMinutes(60);
    }

    public ResetPasswordToken findByToken(String token) {
        return resetPasswordTokenRepository.findByToken(token)
                .orElseThrow(() -> new ResetPasswordTokenNotFoundException("Reset password token not found"));
    }

    public void delete(ResetPasswordToken resetPasswordToken) {
        resetPasswordTokenRepository.delete(resetPasswordToken);
    }
}
