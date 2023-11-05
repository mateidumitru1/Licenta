package com.matei.backend.configuration;

import com.sendgrid.SendGrid;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;

public class SendGridConfiguration {

    @Value("${sendgrid.api.key}")
    private String key;

    @Bean
    public SendGrid getSendGrid() {
        return new SendGrid(key);
    }
}
