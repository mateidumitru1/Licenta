package com.matei.backend.repository;

import com.matei.backend.entity.Location;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface LocationRepository extends JpaRepository<Location, UUID> {
    Optional<Location> findByName(String name);
    void deleteById(UUID id);

    Long countByCreatedAtAfter(LocalDateTime startDate);

    @Query("SELECT l FROM Location l LEFT JOIN FETCH l.eventList e WHERE e.createdAt > :startDate")
    List<Location> findAllWithEventsCreatedAfter(LocalDateTime startDate);
}
