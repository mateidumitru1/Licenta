package com.matei.backend.repository;

import com.matei.backend.entity.QR;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface QRRepository extends JpaRepository<QR, UUID> {

}
