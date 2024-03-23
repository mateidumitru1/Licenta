package com.matei.backend.entity.enums;

import java.time.LocalDateTime;

public enum StatisticsFilter {
    ALL,
    LAST_YEAR,
    LAST_3MONTHS,
    LAST_MONTH,
    LAST_WEEK,
    LAST_DAY;

    public LocalDateTime getStartDate() {
        return switch (this) {
            case LAST_YEAR -> LocalDateTime.now().minusYears(1);
            case LAST_3MONTHS -> LocalDateTime.now().minusMonths(3);
            case LAST_MONTH -> LocalDateTime.now().minusMonths(1);
            case LAST_WEEK -> LocalDateTime.now().minusWeeks(1);
            case LAST_DAY -> LocalDateTime.now().minusDays(1);
            default -> LocalDateTime.MIN;
        };
    }
}
