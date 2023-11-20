package com.matei.backend.controller;

import com.matei.backend.dto.request.UserCreationRequestDto;
import com.matei.backend.dto.request.UserRequestDto;
import com.matei.backend.dto.response.UserResponseDto;
import com.matei.backend.service.UserService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    @PostMapping
    public ResponseEntity<UserResponseDto> createUser(@ModelAttribute UserCreationRequestDto userCreationRequestDto) {
        return ResponseEntity.ok(userService.createUser(userCreationRequestDto));
    }

    @GetMapping
    public ResponseEntity<List<UserResponseDto>> getAllUsers() {
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResponseDto> getUserById(@PathVariable("id") UUID id) {
        return ResponseEntity.ok(userService.getUserById(id));
    }

    @Transactional
    @PatchMapping
    public ResponseEntity<UserResponseDto> updateUser(@ModelAttribute UserRequestDto userRequestDto) {

        return ResponseEntity.ok(userService.updateUser(userRequestDto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable("id") UUID id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
}
