package com.matei.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "top_events")
public class TopEvent {
    @Id
    @GeneratedValue(generator = "uuid4")
    private UUID id;

    @OneToOne
    private Event event;

    private String customDescription;
    private LocalDateTime createdAt;
}
