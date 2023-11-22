package com.matei.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "qrs")
public class QR {
    @Id
    @GeneratedValue(generator = "uuid4")
    private UUID id;

    private Boolean used;
    
    private String image;
}
