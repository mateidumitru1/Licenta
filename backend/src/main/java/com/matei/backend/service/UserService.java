package com.matei.backend.service;

import com.matei.backend.dto.request.*;
import com.matei.backend.dto.response.UserResponseDto;
import com.matei.backend.dto.response.UserWithOrdersResponseDto;
import com.matei.backend.entity.ResetPasswordToken;
import com.matei.backend.entity.User;
import com.matei.backend.entity.enums.Role;
import com.matei.backend.exception.AdminResourceAccessException;
import com.matei.backend.exception.IncorrectOldPasswordException;
import com.matei.backend.exception.PasswordNotMatchingException;
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

    public UserWithOrdersResponseDto getUserById(UUID id) {
        var user = userRepository.findById(id).orElseThrow(() -> new UserNotFoundException("User not found"));

        return modelMapper.map(user, UserWithOrdersResponseDto.class);
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

    public UserWithOrdersResponseDto updateMe(UUID uuid, UserRequestDto userRequestDto) {
        userRepository.partialUpdateUser(
                uuid,
                userRequestDto.getUsername(),
                userRequestDto.getEmail(),
                userRequestDto.getFirstName(),
                userRequestDto.getLastName(),
                userRequestDto.getRole()
        );
        return modelMapper.map(userRepository.findById(uuid).orElseThrow(() -> new UserNotFoundException("User not found")), UserWithOrdersResponseDto.class);
    }

    public void changePassword(UUID uuid, ChangePasswordRequestDto changePasswordRequestDto) {
        var user = userRepository.findById(uuid).orElseThrow(() -> new UserNotFoundException("User not found"));

        if (!passwordEncoder.matches(changePasswordRequestDto.getOldPassword(), user.getPassword())) {
            throw new IncorrectOldPasswordException("Old password is incorrect");
        }

        if (!changePasswordRequestDto.getNewPassword().equals(changePasswordRequestDto.getConfirmPassword())) {
            throw new PasswordNotMatchingException("New password and confirm password do not match");
        }

        user.setPassword(passwordEncoder.encode(changePasswordRequestDto.getNewPassword()));
        userRepository.save(user);
    }
}
