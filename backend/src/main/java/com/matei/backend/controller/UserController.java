package com.matei.backend.controller;

import com.matei.backend.dto.request.ChangePasswordRequestDto;
import com.matei.backend.dto.request.UserCreationRequestDto;
import com.matei.backend.dto.request.UserRequestDto;
import com.matei.backend.dto.response.UserResponseDto;
import com.matei.backend.dto.response.UserWithOrdersResponseDto;
import com.matei.backend.service.JwtService;
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
    private final JwtService jwtService;

    @PostMapping
    public ResponseEntity<UserResponseDto> createUser(@RequestHeader("Authorization") String jwtToken, @ModelAttribute UserCreationRequestDto userCreationRequestDto) {
        return ResponseEntity.ok(userService.createUser(jwtService.extractId(jwtToken), userCreationRequestDto));
    }

    @GetMapping
    public ResponseEntity<List<UserResponseDto>> getAllUsers(@RequestHeader("Authorization") String jwtToken) {
        return ResponseEntity.ok(userService.getAllUsers(jwtService.extractId(jwtToken)));
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResponseDto> getUserById(@RequestHeader("Authorization") String jwtToken, @PathVariable("id") String id) {
        return ResponseEntity.ok(userService.adminGetUserById(jwtService.extractId(jwtToken), UUID.fromString(id)));
    }

    @GetMapping("/me")
    public ResponseEntity<UserWithOrdersResponseDto> getMe(@RequestHeader("Authorization") String jwtToken) {
        return ResponseEntity.ok(userService.getUserById(jwtService.extractId(jwtToken)));
    }

    @Transactional
    @PatchMapping("/me")
    public ResponseEntity<UserWithOrdersResponseDto> updateMe(@RequestHeader("Authorization") String jwtToken,
                                                              @RequestBody UserRequestDto userRequestDto) {
        return ResponseEntity.ok(userService.updateMe(jwtService.extractId(jwtToken), userRequestDto));
    }

    @Transactional
    @PatchMapping
    public ResponseEntity<UserResponseDto> updateUser(@RequestHeader("Authorization") String jwtToken, @ModelAttribute UserRequestDto userRequestDto) {
        return ResponseEntity.ok(userService.updateUser(jwtService.extractId(jwtToken), userRequestDto));
    }

    @PatchMapping("/me/change-password")
    public ResponseEntity<Void> changePassword(@RequestHeader("Authorization") String jwtToken, @RequestBody ChangePasswordRequestDto changePasswordRequestDto) {
        userService.changePassword(jwtService.extractId(jwtToken), changePasswordRequestDto);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@RequestHeader("Authorization") String jwtToken, @PathVariable("id") String id) {
        userService.deleteUser(jwtService.extractId(jwtToken), UUID.fromString(id));
        return ResponseEntity.noContent().build();
    }
}
