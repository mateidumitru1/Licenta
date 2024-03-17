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
import java.util.List;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "orders")
public class Order {
    @Id
    @GeneratedValue(generator = "uuid4")
    private UUID id;

    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(unique = true)
    private Long orderNumber;

    private Status status;
    private Double price;
    private LocalDateTime date;

    @JsonIgnore
    @OnDelete(action = OnDeleteAction.CASCADE)
    @OneToMany(mappedBy = "order")
    private List<Ticket> ticketList;

    @JsonIgnore
    @ManyToOne
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    private User user;

    @Override
    public String toString() {
        return "Order{" +
                "id=" + id +
                ", orderNumber=" + orderNumber +
                ", status=" + status +
                ", price=" + price +
                ", date=" + date +
                '}';
    }
}
