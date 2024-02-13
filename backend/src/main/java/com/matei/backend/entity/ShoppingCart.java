package com.matei.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

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
    @OneToMany(mappedBy = "shoppingCart")
    private List<ShoppingCartItem> shoppingCartItemList;

    @JsonIgnore
    @OneToOne
    private User user;

    @Override
    public String toString() {
        return "ShoppingCart{" +
                "id=" + id +
                ", price=" + price +
                ", shoppingCartItemList=" + shoppingCartItemList +
                '}';
    }
}
