package com.matei.backend.repository;

import com.matei.backend.entity.ShoppingCartItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface ShoppingCartItemRepository extends JpaRepository<ShoppingCartItem, UUID> {
}
