package com.matei.backend.repository;

import com.matei.backend.entity.Genre;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.UUID;

public interface GenreRepository extends JpaRepository<Genre, UUID> {
    List<Genre> findAllByNameIn(List<String> list);

    @Query("SELECT g FROM Genre g JOIN g.artists a WHERE a.id = :artistId")
    List<Genre> findAllByArtistId(UUID artistId);
}
