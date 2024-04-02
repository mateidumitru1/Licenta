package com.matei.backend.repository;

import com.matei.backend.entity.Location;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import javax.swing.text.html.Option;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface LocationRepository extends JpaRepository<Location, UUID> {
    Optional<Location> findByName(String name);
    void deleteById(UUID id);

    Long countByCreatedAtAfter(LocalDateTime startDate);

    @Query("SELECT DISTINCT l FROM Location l LEFT JOIN l.eventList e " +
            "ON e.date >= :today OR e.date IS NULL " +
            "WHERE l.id = :id")
    Optional<Location> findLocationWithAvailableEventsById(@Param("id") UUID id, @Param("today") LocalDate today);

    @Query("SELECT DISTINCT l FROM Location l LEFT JOIN l.eventList e " +
            "ON e.date < :today " +
            "WHERE l.id = :id")
    Optional<Location> findLocationWithUnavailableEventsById(@Param("id") UUID id, @Param("today") LocalDate today);


    @Query("SELECT l FROM Location l LEFT JOIN FETCH l.eventList e WHERE e.createdAt > :startDate")
    List<Location> findAllWithEventsCreatedAfter(@Param("startDate") LocalDateTime startDate);
}
