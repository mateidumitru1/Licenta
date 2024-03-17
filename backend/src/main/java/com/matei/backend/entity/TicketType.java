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
@Table(name = "ticket_types")
public class TicketType {
    @Id
    @GeneratedValue(generator = "uuid4")
    private UUID id;

    private String name;
    private Double price;
    private Integer totalQuantity;
    private Integer remainingQuantity;

    @ManyToOne
    @JoinColumn(name = "event_id", referencedColumnName = "id")
    private Event event;
}
