package com.matei.backend.repository;

import com.matei.backend.entity.Genre;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface GenreRepository extends JpaRepository<Genre, UUID> {
    List<Genre> findAllByNameIn(List<String> list);
}
