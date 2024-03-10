package com.matei.backend.controller;

import com.matei.backend.service.TicketTypeService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/ticket-type")
public class TicketTypeController {
    private final TicketTypeService ticketTypeService;

}
