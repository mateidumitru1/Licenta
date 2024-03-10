package com.matei.backend.repository;

import com.matei.backend.entity.Artist;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ArtistRepository extends JpaRepository<Artist, UUID> {
    Optional<Artist> findByName(String name);
    Optional<List<Artist>> findAllByNameStartingWith(String firstLetter);
}
