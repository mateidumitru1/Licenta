package com.matei.backend.controller;

import com.google.api.Page;
import com.matei.backend.dto.request.auth.ChangePasswordRequestDto;
import com.matei.backend.dto.request.user.UserCreationRequestDto;
import com.matei.backend.dto.request.user.UserRequestDto;
import com.matei.backend.dto.response.user.UserPageWithCountResponseDto;
import com.matei.backend.dto.response.user.UserResponseDto;
import com.matei.backend.dto.response.user.UserWithOrdersResponseDto;
import com.matei.backend.service.auth.JwtService;
import com.matei.backend.service.UserService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;


import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/users")
public class UserController {
    private final UserService userService;
    private final JwtService jwtService;

    @PreAuthorize("hasAuthority('ADMIN')")
    @PostMapping
    public ResponseEntity<UserPageWithCountResponseDto> createUser(@ModelAttribute UserCreationRequestDto userCreationRequestDto,
                                                                   @RequestParam("page") int page,
                                                                   @RequestParam("size") int size) {
        return ResponseEntity.ok(userService.createUser(userCreationRequestDto, page, size));
    }

    @PreAuthorize("hasAuthority('ADMIN')")
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

    @PreAuthorize("hasAuthority('ADMIN')")
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

    @PreAuthorize("hasAuthority('ADMIN')")
    @DeleteMapping("/{id}")
    public ResponseEntity<UserPageWithCountResponseDto> deleteUser(@PathVariable("id") String id,
                                                                   @RequestParam("page") int page,
                                                                   @RequestParam("size") int size) {
        return ResponseEntity.ok(userService.deleteUser(UUID.fromString(id), page, size));
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping
    public ResponseEntity<UserPageWithCountResponseDto> getAllUsersPaginatedManage(@RequestParam("page") int page,
                                                                                   @RequestParam("size") int size) {
        return ResponseEntity.ok(userService.getAllUsersPaginatedManage(page, size));
    }

    @PreAuthorize("hasAuthority('ADMIN')")
    @GetMapping("/filtered")
    public ResponseEntity<UserPageWithCountResponseDto> getAllUsersFilteredPaginatedManage(@RequestParam("page") int page,
                                                                                       @RequestParam("size") int size,
                                                                                       @RequestParam("filter") String filter,
                                                                                       @RequestParam("search") String search) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return ResponseEntity.ok(userService.getAllUsersFilteredPaginatedManage(page, size, filter, search));
    }
}
