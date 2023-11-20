package com.matei.backend.repository;

import com.matei.backend.entity.TicketType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface TicketTypeRepository extends JpaRepository<TicketType, UUID> {
    Optional<List<TicketType>> findByEventId(UUID id);
}
