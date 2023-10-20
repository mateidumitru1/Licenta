package com.matei.backend.repository;

import com.matei.backend.entity.BlackListedToken;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface BlackListedTokenRepository extends JpaRepository<BlackListedToken, String> {

    Optional<BlackListedToken> findByToken(String token);
}
