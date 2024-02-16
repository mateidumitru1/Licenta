package com.matei.backend.repository;

import com.matei.backend.entity.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface TicketRepository extends JpaRepository<Ticket, UUID> {
    Optional<List<Ticket>> findAllByOrderUserId(UUID userId);
}
