package com.matei.backend.repository;

import com.matei.backend.entity.Event;
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

public interface EventRepository extends JpaRepository<Event, UUID> {
    Optional<List<Event>> findByLocationId(UUID locationId);
    Optional<Event> findByTitle(String title);
    Optional<Long> countByCreatedAtAfter(LocalDateTime createdAt);

    @Query("SELECT e FROM Event e WHERE e.createdAt > :startDate")
    List<Event> findAllByCreatedAtAfter(@Param("startDate") LocalDateTime startDate);

    List<Event> findAllBySelectedTrue();

    Page<Event> findByDateAfterAndLocationIdOrderByDateAsc(LocalDate currentDate, UUID locationId, Pageable pageable);

    Page<Event> findAllByOrderByCreatedAtDesc(Pageable pageable);

    @Query("SELECT e FROM Event e WHERE " +
            "(:filter = 'title' AND e.title LIKE %:search%) OR " +
            "(:filter = 'date' AND e.date = CAST(:search as localdate)) OR " +
            "(:filter = 'location' AND e.location.name LIKE %:search%)")
    Page<Event> findFilteredEventsPaginated(String filter, String search, Pageable pageable);

    @Query("SELECT COUNT(*) FROM Event e WHERE " +
            "(:filter = 'title' AND e.title LIKE %:search%) OR " +
            "(:filter = 'date' AND e.date = CAST(:search as localdate)) OR " +
            "(:filter = 'location' AND e.location.name LIKE %:search%)")
    Long countFilteredEvents(String filter, String search);
}
