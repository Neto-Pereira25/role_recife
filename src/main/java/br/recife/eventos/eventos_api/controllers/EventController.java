package br.recife.eventos.eventos_api.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.recife.eventos.eventos_api.dto.event.EventCreateDTO;
import br.recife.eventos.eventos_api.models.entities.Event;
import br.recife.eventos.eventos_api.services.EventService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/events")
public class EventController {

    private final EventService eventService;

    public EventController(EventService eventService) {
        this.eventService = eventService;
    }

    @PostMapping
    public ResponseEntity<Event> createEvent(
            @Valid @RequestBody EventCreateDTO eventDto) {
        Event event = eventService.createEvent(eventDto);
        return new ResponseEntity<>(event, HttpStatus.CREATED);
    }
}
