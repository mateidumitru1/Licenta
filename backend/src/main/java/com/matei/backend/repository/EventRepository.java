package com.matei.backend.repository;

import com.matei.backend.entity.Event;
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
    Optional<Long> countByCreatedAtAfter(LocalDateTime createdAt);
    Optional<List<Event>> findAllByDateAfter(LocalDate currentDate);
    Optional<List<Event>> findAllByCreatedAtAfter(@Param("startDate") LocalDateTime startDate);
    Optional<List<Event>> findAllBySelectedTrueAndDateAfter(LocalDate currentDate);

    Page<Event> findByDateAfterOrderByDateAsc(LocalDate currentDate,
                                              Pageable pageable);

    Page<Event> findByDateAfterAndArtistListNameInOrderByDateAsc(LocalDate currentDate,
                                                               List<String> artistName,
                                                               Pageable pageable);

    Page<Event> findByDateAfterAndBroadGenreNameInOrderByDateAsc(LocalDate currentDate,
                                                               List<String> broadGenreName,
                                                               Pageable pageable);

    Page<Event> findByDateAfterAndLocationNameInOrderByDateAsc(LocalDate currentDate,
                                                             List<String> locationNameList,
                                                             Pageable pageable);

    Page<Event> findByDateAfterAndLocationNameInAndBroadGenreNameInOrderByDateAsc(LocalDate currentDate,
                                                                              List<String> locationName,
                                                                              List<String> broadGenreName,
                                                                              Pageable pageable);

    Page<Event> findByDateAfterAndArtistListNameInAndBroadGenreNameInOrderByDateAsc(LocalDate currentDate,
                                                                                    List<String> artistName,
                                                                                    List<String> broadGenreName,
                                                                                    Pageable pageable);

    Page<Event> findByDateAfterAndLocationNameInAndArtistListNameInOrderByDateAsc(LocalDate currentDate,
                                                                                  List<String> locationName,
                                                                                  List<String> artistName,
                                                                                  Pageable pageable);

    Page<Event> findByDateAfterAndLocationNameInAndArtistListNameInAndBroadGenreNameInOrderByDateAsc(LocalDate currentDate,
                                                                                                     List<String> locationName,
                                                                                                     List<String> artistName,
                                                                                                     List<String> broadGenreName,
                                                                                                     Pageable pageable);
    Page<Event> findByDateBetweenOrderByDateAsc(LocalDate startDate,
                                                LocalDate endDate,
                                                Pageable pageable);

    Page<Event> findByDateBetweenAndLocationNameInOrderByDateAsc(LocalDate startDate,
                                                                LocalDate endDate,
                                                                List<String> locationName,
                                                                Pageable pageable);

    Page<Event> findByDateBetweenAndArtistListNameInOrderByDateAsc(LocalDate startDate,
                                                                   LocalDate endDate,
                                                                   List<String> artistName,
                                                                   Pageable pageable);

    Page<Event> findByDateBetweenAndBroadGenreNameInOrderByDateAsc(LocalDate startDate,
                                                                     LocalDate endDate,
                                                                     List<String> broadGenreName,
                                                                     Pageable pageable);

    Page<Event> findByDateBetweenAndLocationNameInAndBroadGenreNameInOrderByDateAsc(LocalDate startDate,
                                                                                   LocalDate endDate,
                                                                                   List<String> locationName,
                                                                                   List<String> broadGenreName,
                                                                                   Pageable pageable);

    Page<Event> findByDateBetweenAndArtistListNameInAndBroadGenreNameInOrderByDateAsc(LocalDate startDate,
                                                                                     LocalDate endDate,
                                                                                     List<String> artistName,
                                                                                     List<String> broadGenreName,
                                                                                     Pageable pageable);

    Page<Event> findByDateBetweenAndLocationNameInAndArtistListNameInOrderByDateAsc(LocalDate startDate,
                                                                                    LocalDate endDate,
                                                                                      List<String> locationName,
                                                                                      List<String> artistName,
                                                                                      Pageable pageable);

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

    @Query("SELECT e FROM Event e join e.broadGenre bg WHERE bg.name IN :broadGenreNameList AND e.date > :now")
    Optional<List<Event>> findAllByBroadGenreInAndDateAfter(List<String> broadGenreNameList, LocalDate now);

    List<Event> findByTitleContainingIgnoreCase(String query, Pageable pageable);
}
