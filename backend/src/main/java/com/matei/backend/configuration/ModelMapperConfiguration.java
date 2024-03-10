package com.matei.backend.configuration;

import org.hibernate.collection.spi.PersistentBag;
import org.modelmapper.ModelMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;

@Configuration
public class ModelMapperConfiguration {

    @Bean
    public ModelMapper modelMapper() {
        ModelMapper modelMapper = new ModelMapper();

        modelMapper.createTypeMap(PersistentBag.class, List.class)
                .setConverter(context -> context.getSource().stream().toList());

        return modelMapper;
    }
}
