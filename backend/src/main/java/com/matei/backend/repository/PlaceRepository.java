package com.matei.backend.repository;

import com.matei.backend.entity.Place;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface PlaceRepository extends JpaRepository<Place, UUID> {
    Optional<Place> findByName(String name);
    void deleteById(UUID id);
}
