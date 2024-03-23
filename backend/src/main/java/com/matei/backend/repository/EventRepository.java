package com.matei.backend.repository;

import com.matei.backend.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface EventRepository extends JpaRepository<Event, UUID> {
    Optional<List<Event>> findByLocationId(UUID locationId);
    Optional<Event> findByTitle(String title);
    Long countByCreatedAtAfter(LocalDateTime createdAt);

    @Query("SELECT e FROM Event e LEFT JOIN FETCH e.location")
    List<Event> findAllEventsWithLocation();
}
