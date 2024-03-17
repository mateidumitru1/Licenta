package com.matei.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "locations")
public class Location {
    @Id
    @GeneratedValue(generator = "uuid4")
    private UUID id;

    @Column(unique = true)
    private String name;

    private String address;
    private String imageUrl;
    private Double latitude;
    private Double longitude;
    private LocalDateTime createdAt;


    @JsonIgnore
    @OneToMany(mappedBy = "location")
    private List<Event> eventList;

    @Override
    public String toString() {
        return "Location{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", address='" + address + '\'' +
                ", imageUrl='" + imageUrl + '\'' +
                '}';
    }
}