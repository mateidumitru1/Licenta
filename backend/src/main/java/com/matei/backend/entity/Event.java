package com.matei.backend.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Value;

import java.time.LocalDate;
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
    private String shortDescription;
    private String description;
    private String imageUrl;
    @ManyToOne
    @JoinColumn(name = "place_id", referencedColumnName = "id")
    private Place place;
}
