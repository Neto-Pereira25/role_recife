package br.recife.eventos.eventos_api.controllers;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import br.recife.eventos.eventos_api.dto.event.EventCreateDTO;
import br.recife.eventos.eventos_api.dto.event.EventFilter;
import br.recife.eventos.eventos_api.dto.event.EventResponseDTO;
import br.recife.eventos.eventos_api.dto.event.EventUpdateDTO;
import br.recife.eventos.eventos_api.models.entities.Event;
import br.recife.eventos.eventos_api.models.entities.Event.EventType;
import br.recife.eventos.eventos_api.models.entities.Event.SpaceType;
import br.recife.eventos.eventos_api.services.EventService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/events")
public class EventController {

    private final EventService eventService;

    public EventController(EventService eventService) {
        this.eventService = eventService;
    }

    @PreAuthorize("hasRole('EVENT_OWNER_USER')")
    @PostMapping
    public ResponseEntity<Event> createEvent(
            @Valid @RequestBody EventCreateDTO eventDto) {
        Event event = eventService.createEvent(eventDto);
        return new ResponseEntity<>(event, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<EventResponseDTO>> getAllEvents() {
        List<EventResponseDTO> events = eventService.listAllEvents();

        return ResponseEntity.ok(events);
    }

    @GetMapping("/{id}")
    public ResponseEntity<EventResponseDTO> getEventById(@PathVariable Long id) {
        EventResponseDTO event = eventService.getEventById(id);
        return ResponseEntity.ok(event);
    }

    @PreAuthorize("hasRole('EVENT_OWNER_USER')")
    @PutMapping("/{id}")
    public ResponseEntity<EventResponseDTO> updateEvent(@PathVariable Long id, @Valid @RequestBody EventUpdateDTO dto) {
        return ResponseEntity.ok(eventService.updateEvent(id, dto));
    }

    @PreAuthorize("hasRole('EVENT_OWNER_USER')")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEvent(@PathVariable Long id) {
        eventService.deleteEvent(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search")
    public ResponseEntity<List<EventResponseDTO>> searchEvents(
            @RequestParam(required = false) EventType type,
            @RequestParam(required = false) SpaceType spaceType,
            @RequestParam(required = false) LocalDateTime dateAfter,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String query) {
        EventFilter filter = new EventFilter();

        filter.setType(type);
        filter.setSpaceType(spaceType);
        filter.setDateAfter(dateAfter);
        filter.setLocation(location);
        filter.setQuery(query);

        List<EventResponseDTO> results = eventService.searchEvents(filter);
        return ResponseEntity.ok(results);
    }
}
