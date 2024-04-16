package com.matei.backend.repository;

import com.matei.backend.entity.Location;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface LocationRepository extends JpaRepository<Location, UUID> {
    Optional<Location> findByName(String name);
    void deleteById(UUID id);

    Long countByCreatedAtAfter(LocalDateTime startDate);

    @Query("SELECT l FROM Location l LEFT JOIN FETCH l.eventList e WHERE e.date >= :date OR e.date is NULL")
    Optional<List<Location>> findLocationsByEventListDateAfter(LocalDate date);

    @Query("SELECT l FROM Location l LEFT JOIN FETCH l.eventList e WHERE e.createdAt > :startDate")
    List<Location> findAllWithEventsCreatedAfter(@Param("startDate") LocalDateTime startDate);

    Page<Location> findAllByOrderByCreatedAtDesc(Pageable pageable);

    @Query("SELECT l FROM Location l WHERE " +
            "(:filter = 'name' AND l.name LIKE %:search%) OR " +
            "(:filter = 'address' AND l.address LIKE %:search%)")
    Page<Location> findFilteredLocationsPaginated(String filter, String search, Pageable pageable);

    @Query("SELECT COUNT(*) FROM Location l WHERE " +
            "(:filter = 'name' AND l.name LIKE %:search%) OR " +
            "(:filter = 'address' AND l.address LIKE %:search%)")
    Long countFilteredLocations(String filter, String search);

    List<Location> findByNameContainingIgnoreCase(String query, Pageable pageable);
}
