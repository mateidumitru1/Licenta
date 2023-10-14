package com.matei.backend.repository;

import com.matei.backend.entity.Event;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface EventRepository extends JpaRepository<Event, UUID> {
    Optional<List<Event>> findByPlaceName(String placeId);

    Optional<Event> findByTitle(String title);
}
