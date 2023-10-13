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
@Table(name = "places")
public class Place {
    @Id
    @GeneratedValue(generator = "uuid4")
    private UUID id;
    private String name;
    private String address;

    @JsonIgnore
    @OneToMany(mappedBy = "place", fetch = FetchType.EAGER, cascade = CascadeType.MERGE, orphanRemoval = true)
    private List<Event> eventList;
}