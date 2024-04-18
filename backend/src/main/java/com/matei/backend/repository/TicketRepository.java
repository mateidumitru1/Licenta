package com.matei.backend.repository;

import com.matei.backend.entity.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface TicketRepository extends JpaRepository<Ticket, UUID> {
    Optional<List<Ticket>> findAllByOrderUserId(UUID userId);
    Optional<List<Ticket>> findAllByOrderUserIdAndTicketTypeEventId(UUID orderUserId, UUID ticketTypeEventId);

    @Query("SELECT COUNT(t) FROM Ticket t WHERE t.status = 0")
    Long countByStatusConfirmed();

    @Query("SELECT COUNT(t) FROM Ticket t WHERE t.order.createdAt > :startDate AND t.status = 0")
    Long countByCreatedAtAfterAndStatusConfirmed(@Param("startDate") LocalDateTime startDate);
}
