package com.matei.backend.repository;

import com.matei.backend.entity.BroadGenre;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface BroadGenreRepository extends JpaRepository<BroadGenre, UUID> {
    Optional<List<BroadGenre>> findAllByOrderByName();

}
