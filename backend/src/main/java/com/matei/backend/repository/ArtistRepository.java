package com.matei.backend.repository;

import com.matei.backend.entity.Artist;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface ArtistRepository extends JpaRepository<Artist, UUID> {
    Optional<Artist> findByName(String name);
    Optional<List<Artist>> findAllByNameStartingWith(String firstLetter);

    Page<Artist> findAllByOrderByCreatedAtDesc(PageRequest of);

    @Query("SELECT a FROM Artist a WHERE " +
            "(:filter = 'name' AND a.name LIKE %:search%) OR " +
            "(:filter = 'genre' AND EXISTS (SELECT g FROM a.genreList g WHERE g.name LIKE %:search%))")
    Page<Artist> findFilteredArtistsPaginated(String filter, String search, PageRequest of);

    @Query("SELECT COUNT(*) FROM Artist a WHERE " +
            "(:filter = 'name' AND a.name LIKE %:search%) OR " +
            "(:filter = 'genre' AND EXISTS (SELECT g FROM a.genreList g WHERE g.name LIKE %:search%))")
    Long countFilteredArtists(String filter, String search);
}
