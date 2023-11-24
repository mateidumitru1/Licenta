package com.matei.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "shopping_carts")
public class ShoppingCart {
    @Id
    @GeneratedValue(generator = "uuid4")
    private UUID id;

    private Double price;

    @JsonIgnore
    @ManyToMany
    @JoinTable(
            name = "shopping_cart_ticket_types",
            joinColumns = @JoinColumn(name = "shopping_cart_id"),
            inverseJoinColumns = @JoinColumn(name = "ticket_type_id")
    )
    private List<TicketType> ticketTypeList;

    @JsonIgnore
    @OneToOne
    private User user;
}
