package com.matei.backend.repository;

import com.matei.backend.entity.util.Role;
import com.matei.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);

    @Modifying
    @Query("UPDATE User u " +
            "SET u.username = :username, u.email = :email, u.firstName = :firstName, u.lastName = :lastName, u.role = :role " +
            "WHERE u.id = :id")
    void partialUpdateUser(@Param("id") UUID id, @Param("username") String username, @Param("email") String email,
                           @Param("firstName") String firstName, @Param("lastName") String lastName, @Param("role") Role role);
}
