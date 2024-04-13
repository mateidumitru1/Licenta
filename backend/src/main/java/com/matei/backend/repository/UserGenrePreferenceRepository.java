package com.matei.backend.repository;

import com.matei.backend.entity.TicketType;
import com.matei.backend.entity.User;
import com.matei.backend.entity.UserGenrePreference;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface UserGenrePreferenceRepository  extends JpaRepository<UserGenrePreference, UUID> {
    Optional<List<UserGenrePreference>> findByUser(User user);
}
