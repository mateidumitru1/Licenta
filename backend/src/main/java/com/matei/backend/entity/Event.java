package com.matei.backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity
@Table(name = "events")
public class Event {
    @Id
    @GeneratedValue(generator = "uuid4")
    private UUID id;
    private String title;
    private LocalDate date;
    private Boolean selected;

    @Column(length = 6200)
    private String shortDescription;

    @Column(length = 9500)
    private String description;
    private String imageUrl;
    private LocalDateTime createdAt;

    @JsonIgnore
    @ManyToOne
    @OnDelete(action = OnDeleteAction.SET_NULL)
    @JoinColumn(name = "location_id", referencedColumnName = "id")
    private Location location;

    @JsonIgnore
    @OneToMany(mappedBy = "event")
    @OnDelete(action = OnDeleteAction.SET_NULL)
    private List<TicketType> ticketTypeList;

    @JsonIgnore
    @ManyToMany
    @JoinTable(
            name = "event_artists",
            joinColumns = @JoinColumn(name = "event_id"),
            inverseJoinColumns = @JoinColumn(name = "artist_id")
    )
    @OnDelete(action = OnDeleteAction.CASCADE)
    private List<Artist> artistList;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "broad_genre_id", referencedColumnName = "id")
    @OnDelete(action = OnDeleteAction.SET_NULL)
    private BroadGenre broadGenre;

    @Override
    public String toString() {
        return "Event{" +
                "id=" + id +
                ", title='" + title + '\'' +
                ", date=" + date +
                ", shortDescription='" + shortDescription + '\'' +
                ", description='" + description + '\'' +
                ", imageUrl='" + imageUrl + '\'' +
                '}';
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj) {
            return true;
        }
        if (obj == null || getClass() != obj.getClass()) {
            return false;
        }
        Event event = (Event) obj;
        return id.equals(event.id) && title.equals(event.title);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, title);
    }
}
