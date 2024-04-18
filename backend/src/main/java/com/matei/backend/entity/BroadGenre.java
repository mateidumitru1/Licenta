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
@Table(name = "broad_genres")
public class BroadGenre {
    @Id
    @GeneratedValue(generator = "uuid4")
    private UUID id;

    private String name;

    @JsonIgnore
    @OneToMany(mappedBy = "broadGenre", fetch = FetchType.EAGER)
    private List<Event> eventList;
}
