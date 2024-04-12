package com.matei.backend.repository;

import com.matei.backend.entity.enums.Role;
import com.matei.backend.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    Long countByCreatedAtAfter(LocalDateTime createdAt);

    @Modifying
    @Query("UPDATE User u " +
            "SET u.username = :username, u.email = :email, u.firstName = :firstName, u.lastName = :lastName, u.role = :role " +
            "WHERE u.id = :id")
    void partialUpdateUser(@Param("id") UUID id, @Param("username") String username, @Param("email") String email,
                           @Param("firstName") String firstName, @Param("lastName") String lastName, @Param("role") Role role);

    Page<User> findAllByOrderByCreatedAtDesc(Pageable pageable);

    @Query("SELECT u FROM User u WHERE " +
            "(:filter = 'username' AND u.username LIKE %:search%) OR " +
            "(:filter = 'email' AND u.email LIKE %:search%) OR " +
            "(:filter = 'firstName' AND u.firstName LIKE %:search%) OR " +
            "(:filter = 'lastName' AND u.lastName LIKE %:search%)")
    Page<User> findFilteredUsersPaginated(String filter, String search, PageRequest of);

    @Query("SELECT COUNT(*) FROM User u WHERE " +
            "(:filter = 'username' AND u.username LIKE %:search%) OR " +
            "(:filter = 'email' AND u.email LIKE %:search%) OR " +
            "(:filter = 'firstName' AND u.firstName LIKE %:search%) OR " +
            "(:filter = 'lastName' AND u.lastName LIKE %:search%)")
    Long countFilteredUsers(String filter, String search);
}
