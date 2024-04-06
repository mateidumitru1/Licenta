package com.matei.backend.dto.response.event;

import com.matei.backend.dto.response.location.LocationWithoutEventListResponseDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.Objects;
import java.util.UUID;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class RecommendedEventResponseDto {
    private UUID id;
    private String title;
    private LocalDate date;
    private LocationWithoutEventListResponseDto location;
    private String imageUrl;
    private String broadGenre;

    @Override
    public String toString() {
        return "RecommendedEventResponseDto{" +
                "id=" + id +
                ", title='" + title + '\'' +
                ", date=" + date +
                ", location=" + location +
                ", imageUrl='" + imageUrl + '\'' +
                ", broadGenre='" + broadGenre + '\'' +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        RecommendedEventResponseDto that = (RecommendedEventResponseDto) o;

        if (!Objects.equals(id, that.id)) return false;
        if (!Objects.equals(title, that.title)) return false;
        if (!Objects.equals(date, that.date)) return false;
        if (!Objects.equals(location.getName(), that.location.getName())) return false;
        return Objects.equals(imageUrl, that.imageUrl);
    }

    @Override
    public int hashCode() {
        int result = id != null ? id.hashCode() : 0;
        result = 31 * result + (title != null ? title.hashCode() : 0);
        result = 31 * result + (date != null ? date.hashCode() : 0);
        result = 31 * result + (location != null ? location.hashCode() : 0);
        result = 31 * result + (imageUrl != null ? imageUrl.hashCode() : 0);
        return result;
    }
}
