package com.matei.backend.repository;

import com.matei.backend.entity.TopEvent;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface TopEventRepository extends JpaRepository<TopEvent, UUID> {
    Optional<TopEvent> findByEventId(UUID eventId);
}
