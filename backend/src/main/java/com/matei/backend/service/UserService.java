package com.matei.backend.service;

import com.matei.backend.dto.request.auth.ChangePasswordRequestDto;
import com.matei.backend.dto.request.user.UserCreationRequestDto;
import com.matei.backend.dto.request.user.UserRequestDto;
import com.matei.backend.dto.response.order.OrderResponseDto;
import com.matei.backend.dto.response.preference.UserGenrePreferenceResponseDto;
import com.matei.backend.dto.response.ticket.TicketResponseDto;
import com.matei.backend.dto.response.ticketType.TicketTypeEventWithoutArtistResponseDto;
import com.matei.backend.dto.response.user.UserPageWithCountResponseDto;
import com.matei.backend.dto.response.user.UserResponseDto;
import com.matei.backend.dto.response.user.UserWithOrdersResponseDto;
import com.matei.backend.entity.User;
import com.matei.backend.entity.enums.Role;
import com.matei.backend.entity.enums.StatisticsFilter;
import com.matei.backend.exception.resourceAccess.AdminResourceAccessException;
import com.matei.backend.exception.auth.IncorrectOldPasswordException;
import com.matei.backend.exception.auth.PasswordNotMatchingException;
import com.matei.backend.exception.user.UserNotFoundException;
import com.matei.backend.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@Transactional
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final ModelMapper modelMapper;

    public UserPageWithCountResponseDto createUser(UserCreationRequestDto userCreationRequestDto, int page, int size) {
        var userToSave = modelMapper.map(userCreationRequestDto, User.class);
        userToSave.setPassword(passwordEncoder.encode(userCreationRequestDto.getPassword()));
        userToSave.setEnabled(true);
        userToSave.setCreatedAt(LocalDateTime.now());

        var user = userRepository.save(userToSave);

        return getAllUsersPaginatedManage(page, size);
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

        var userDto = modelMapper.map(user, UserWithOrdersResponseDto.class);
        userDto.setGenrePreferences(user.getUserGenrePreferenceList().stream().map(genrePreference ->
            modelMapper.map(genrePreference, UserGenrePreferenceResponseDto.class)).toList());

        userDto.setOrderList(user.getOrderList().stream().map(order -> {
            var orderDto = modelMapper.map(order, OrderResponseDto.class);
            orderDto.setTicketList(order.getTicketList().stream().map(ticket -> {
                var ticketDto = modelMapper.map(ticket, TicketResponseDto.class);
                ticketDto.setTicketType(modelMapper.map(ticket.getTicketType(), TicketTypeEventWithoutArtistResponseDto.class));
                return ticketDto;
            }).toList());
            return orderDto;
        }).toList());

        return userDto;
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

    public UserPageWithCountResponseDto deleteUser(UUID id, int page, int size) {
        userRepository.deleteById(id);
        return getAllUsersPaginatedManage(page, size);
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

    public Long getTotalNumberOfUsers(StatisticsFilter filter) {
        if (filter.equals(StatisticsFilter.ALL)) {
            return userRepository.count();
        }
        return userRepository.countByCreatedAtAfter(filter.getStartDate());
    }

    public UserPageWithCountResponseDto getAllUsersPaginatedManage(int page, int size) {
        Page<User> userPage = userRepository.findAllByOrderByCreatedAtDesc(PageRequest.of(page, size));
        return UserPageWithCountResponseDto.builder()
                .userPage(userPage.map(user -> modelMapper.map(user, UserResponseDto.class)))
                .count(userRepository.count())
                .build();
    }

    public UserPageWithCountResponseDto getAllUsersFilteredPaginatedManage(int page, int size, String filter, String search) {
        Page<User> userPage = userRepository.findFilteredUsersPaginated(filter, search, PageRequest.of(page, size));
        return UserPageWithCountResponseDto.builder()
                .userPage(userPage.map(user -> modelMapper.map(user, UserResponseDto.class)))
                .count(userRepository.countFilteredUsers(filter, search))
                .build();
    }
}
