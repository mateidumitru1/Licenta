package com.matei.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
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
@Table(name = "artists")
public class Artist {
    @Id
    @GeneratedValue(generator = "uuid4")
    private UUID id;

    @Column(unique = true)
    private String name;

    private String imageUrl;

    private LocalDateTime createdAt;

    @JsonIgnore
    @ManyToMany(mappedBy = "artistList")
    @OnDelete(action = OnDeleteAction.CASCADE)
    private List<Event> eventList;

    @JsonIgnore
    @ManyToMany(mappedBy = "artists")
    @OnDelete(action = OnDeleteAction.CASCADE)
    private List<Genre> genreList;

    @Override
    public String toString() {
        return "Artist{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", imageUrl='" + imageUrl + '\'' +
                '}';
    }
}
