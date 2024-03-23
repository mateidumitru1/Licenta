package com.matei.backend.repository;

import com.matei.backend.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface OrderRepository extends JpaRepository<Order, UUID> {
    Optional<List<Order>> findAllByUserId(UUID id);

    Optional<Order> findByOrderNumber(Long number);

    Long countByCreatedAtAfter(LocalDateTime startDate);
}
