package com.matei.backend.service;

import com.matei.backend.dto.response.broadGenre.BroadGenreResponseDto;
import com.matei.backend.entity.BroadGenre;
import com.matei.backend.exception.broadGenre.BroadGenreNotFoundException;
import com.matei.backend.repository.BroadGenreRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BroadGenreService {
    private final BroadGenreRepository broadGenreRepository;
    private final ModelMapper modelMapper;

    public List<BroadGenreResponseDto> getAllBroadGenres() {
        return broadGenreRepository.findAllByOrderByName().orElseThrow(() -> new BroadGenreNotFoundException("Broad genres not found"))
                .stream()
                .map(broadGenre -> modelMapper.map(broadGenre, BroadGenreResponseDto.class))
                .toList();
    }

    public List<String> getAllBroadGenreNames() {
        return broadGenreRepository.findAllByOrderByName().orElseThrow(() -> new BroadGenreNotFoundException("Broad genres not found"))
                .stream()
                .map(BroadGenre::getName)
                .toList();
    }
}
