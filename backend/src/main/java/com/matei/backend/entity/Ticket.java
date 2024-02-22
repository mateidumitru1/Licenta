package com.matei.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.matei.backend.entity.enums.Status;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "tickets")
public class Ticket {
    @Id
    private UUID id;
    private Status status;
    private Boolean scanned;

    @Column(length = 100000)
    private String image;

    private LocalDateTime scannedAt;

    @JsonIgnore
    @OneToOne
    private TicketType ticketType;

    @JsonIgnore
    @OnDelete(action = OnDeleteAction.CASCADE)
    @ManyToOne
    @JoinColumn(name = "order_id", referencedColumnName = "id")
    private Order order;
}
