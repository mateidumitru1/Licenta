package com.matei.backend.controller;

import com.matei.backend.dto.request.artist.ArtistCreationRequestDto;
import com.matei.backend.dto.request.artist.ArtistUpdateRequestDto;
import com.matei.backend.dto.response.artist.ArtistPageWithCountResponseDto;
import com.matei.backend.dto.response.artist.ArtistResponseDto;
import com.matei.backend.dto.response.artist.ArtistWithoutEventGenreResponseDto;
import com.matei.backend.dto.response.artist.ArtistWithoutEventResponseDto;
import com.matei.backend.service.ArtistService;
import jakarta.websocket.server.PathParam;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/artists")
public class ArtistController {
    private final ArtistService artistService;

    @PreAuthorize("hasAuthority('ADMIN')")
    @PostMapping
    public ResponseEntity<ArtistPageWithCountResponseDto> createArtist(@ModelAttribute ArtistCreationRequestDto artistCreationRequestDto,
                                                                       @PathParam("page") int page,
                                                                       @PathParam("size") int size) throws IOException {
        return ResponseEntity.ok(artistService.createArtist(artistCreationRequestDto, page, size));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ArtistResponseDto> getArtistById(@PathVariable String id) {
        return ResponseEntity.ok(artistService.getArtistById(UUID.fromString(id)));
    }

    @GetMapping("/without-event-genre")
    public ResponseEntity<List<ArtistWithoutEventGenreResponseDto>> getAllArtistsWithoutEventGenre() {
        return ResponseEntity.ok(artistService.getAllArtistsWithoutEventGenre());
    }

    @GetMapping("/first-letter/{firstLetter}")
    public ResponseEntity<List<ArtistResponseDto>> getAllArtistsByFirstLetter(@PathVariable String firstLetter) {
        return ResponseEntity.ok(artistService.getAllArtistsByFirstLetter(firstLetter));
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @PutMapping
    public ResponseEntity<ArtistResponseDto> updateArtistById(@ModelAttribute ArtistUpdateRequestDto artistUpdateRequestDto) throws IOException {
        return ResponseEntity.ok(artistService.updateArtist(artistUpdateRequestDto));
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<ArtistPageWithCountResponseDto> deleteArtistById(@PathVariable String id,
                                                 @PathParam("page") int page,
                                                 @PathParam("size") int size) {
        return ResponseEntity.ok(artistService.deleteArtistById(UUID.fromString(id), page, size));
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping
    public ResponseEntity<ArtistPageWithCountResponseDto> getAllArtistsPaginatedManage(@RequestParam(defaultValue = "0") int page,
                                                                                       @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(artistService.getAllArtistsPaginatedManage(page, size));
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping("/filtered")
    public ResponseEntity<ArtistPageWithCountResponseDto> getArtistsFilteredPaginatedManage(@RequestParam(defaultValue = "0") int page,
                                                                                             @RequestParam(defaultValue = "10") int size,
                                                                                             @RequestParam String filter,
                                                                                             @RequestParam String search) {
        return ResponseEntity.ok(artistService.getFilteredArtistsPaginatedManage(page, size, filter, search));
    }

    @GetMapping("/names")
    public ResponseEntity<List<String>> getAllArtistNames() {
        return ResponseEntity.ok(artistService.getAllArtistNames());
    }
}
