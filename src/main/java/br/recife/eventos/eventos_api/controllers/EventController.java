package br.recife.eventos.eventos_api.controllers;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import br.recife.eventos.eventos_api.config.JwtTokenUtil;
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
@CrossOrigin(origins = "http://localhost:5500")
public class EventController {

    private final EventService eventService;
    private final JwtTokenUtil jwtTokenUtil;

    public EventController(EventService eventService, JwtTokenUtil jwtTokenUtil) {
        this.eventService = eventService;
        this.jwtTokenUtil = jwtTokenUtil;
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
    @GetMapping("/mine")
    public ResponseEntity<?> getOwnerEvents(@RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.replace("Bearer ", "");
            String[] user = jwtTokenUtil.getSubjectFromToken(token).split("-");

            Long userId = Long.parseLong(user[0]);

            System.out.println("\n\nToken do usuário: " + token);
            System.out.println("\n\nEmail do usuário: " + userId);

            if (!user[1].equals("EVENT_OWNER_USER")) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Acesso restrito à donos de evento.");
            }

            List<Event> myEvents = eventService.getEventsByOwner(userId);
            return ResponseEntity.ok(myEvents);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token inválido ou expirado");
        }
    }

    @PreAuthorize("hasRole('EVENT_OWNER_USER')")
    @PutMapping("/{id}")
    public ResponseEntity<EventResponseDTO> updateEvent(@PathVariable Long id, @Valid @RequestBody EventUpdateDTO dto) {

        Event updated = eventService.updateEvent(id, dto);
        return ResponseEntity.ok(eventService.mapToDTO(updated));
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
