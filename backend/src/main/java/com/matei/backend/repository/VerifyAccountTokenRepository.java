package com.matei.backend.repository;

import com.matei.backend.entity.User;
import com.matei.backend.entity.VerifyAccountToken;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface VerifyAccountTokenRepository extends JpaRepository<VerifyAccountToken, UUID> {
    Optional<VerifyAccountToken> findByUser(User user);

    Optional<VerifyAccountToken> findByToken(String token);
}
