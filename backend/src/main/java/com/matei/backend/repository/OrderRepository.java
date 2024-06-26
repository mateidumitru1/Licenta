package com.matei.backend.repository;

import com.matei.backend.entity.Order;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface OrderRepository extends JpaRepository<Order, UUID> {
    Optional<List<Order>> findAllByUserId(UUID id);

    Optional<Order> findByOrderNumber(Long number);

    @Query("SELECT MAX(o.orderNumber) FROM Order o")
    Optional<Long> findMaxOrderNumber();

    @Query("SELECT COUNT(o) FROM Order o WHERE o.createdAt > :startDate AND o.status = 0")
    Long countByCreatedAtAfterAndStatusConfirmed(LocalDateTime startDate);

    @Query("SELECT COUNT(o) FROM Order o WHERE o.status = 0")
    Long countByStatusConfirmed();

    @Query("SELECT SUM(o.price) FROM Order o WHERE o.status = 0")
    Double sumPriceByStatusConfirmed();

    @Query("SELECT SUM(o.price) FROM Order o WHERE o.createdAt > :startDate AND o.status = 0")
    Double sumPriceByCreatedAtAfterAndStatusConfirmed(LocalDateTime startDate);

    Page<Order> findAllByUserIdOrderByCreatedAtDesc(UUID id, Pageable pageable);

    Page<Order> findByUserIdAndCreatedAtAfterOrderByCreatedAtDesc(UUID id, LocalDateTime startDate, Pageable pageable);

    Long countByUserId(UUID id);
}
