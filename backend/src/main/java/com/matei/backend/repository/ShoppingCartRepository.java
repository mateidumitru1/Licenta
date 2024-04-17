package com.matei.backend.repository;

import com.matei.backend.entity.ShoppingCart;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;
import java.util.UUID;

public interface ShoppingCartRepository extends JpaRepository<ShoppingCart, UUID> {
    Optional<ShoppingCart> findByUserId(UUID userId);

    @Query("SELECT COUNT(i) FROM ShoppingCart s JOIN s.shoppingCartItemList i WHERE s.user.id = :uuid")
    Optional<Integer> findShoppingCartSize(UUID uuid);
}
