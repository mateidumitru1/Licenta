package com.matei.backend.service;

import com.matei.backend.dto.request.AuthenticationRequestDto;
import com.matei.backend.dto.request.RegisterRequestDto;
import com.matei.backend.dto.request.UserCreationRequestDto;
import com.matei.backend.dto.request.UserRequestDto;
import com.matei.backend.dto.response.UserResponseDto;
import com.matei.backend.entity.ResetPasswordToken;
import com.matei.backend.entity.User;
import com.matei.backend.entity.enums.Role;
import com.matei.backend.exception.AdminResourceAccessException;
import com.matei.backend.exception.UserNotFoundException;
import com.matei.backend.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final ModelMapper modelMapper;

    public UserResponseDto createUser(UUID currentUserId, UserCreationRequestDto userCreationRequestDto) {
        if (!isAdmin(currentUserId)) {
            throw new AdminResourceAccessException("You are not authorized to perform this action");
        }
        var user = userRepository.save(modelMapper.map(userCreationRequestDto, User.class));

        return modelMapper.map(user, UserResponseDto.class);
    }

    public List<UserResponseDto> getAllUsers(UUID currentUserId) {
        if (!isAdmin(currentUserId)) {
            throw new AdminResourceAccessException("You are not authorized to perform this action");
        }
        return userRepository.findAll().stream().map(user -> modelMapper.map(user, UserResponseDto.class)).toList();
    }

    public UserResponseDto adminGetUserById(UUID currentUserId, UUID id) {
        if (!isAdmin(currentUserId)) {
            throw new AdminResourceAccessException("You are not authorized to perform this action");
        }
        var user = userRepository.findById(id).orElseThrow(() -> new UserNotFoundException("User not found"));

        return modelMapper.map(user, UserResponseDto.class);
    }

    public UserResponseDto getUserById(UUID id) {
        var user = userRepository.findById(id).orElseThrow(() -> new UserNotFoundException("User not found"));

        return modelMapper.map(user, UserResponseDto.class);
    }

    public UserResponseDto updateUser(UUID currentUserId, UserRequestDto userRequestDto) {
        if (!isAdmin(currentUserId)) {
            throw new AdminResourceAccessException("You are not authorized to perform this action");
        }
        userRepository.partialUpdateUser(
                userRequestDto.getId(),
                userRequestDto.getUsername(),
                userRequestDto.getEmail(),
                userRequestDto.getFirstName(),
                userRequestDto.getLastName(),
                userRequestDto.getRole()
        );
        return modelMapper.map(userRepository.findById(userRequestDto.getId()).orElseThrow(() -> new UserNotFoundException("User not found")), UserResponseDto.class);
    }

    public void deleteUser(UUID currentUserId, UUID id) {
        if (!isAdmin(currentUserId)) {
            throw new AdminResourceAccessException("You are not authorized to perform this action");
        }
        userRepository.deleteById(id);
    }

    public boolean isAdmin(UUID userId) {
        var user = userRepository.findById(userId).orElseThrow(() -> new UserNotFoundException("User not found"));

        return user.getRole().equals(Role.ADMIN);
    }
}
