package br.recife.eventos.eventos_api.controllers;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.recife.eventos.eventos_api.dto.event.EventResponseDTO;
import br.recife.eventos.eventos_api.models.entities.Event;
import br.recife.eventos.eventos_api.services.EventService;
import br.recife.eventos.eventos_api.services.FavoriteService;

@RestController
@RequestMapping("/api/favorites")
public class FavoriteController {

    private final FavoriteService favoriteService;
    private final EventService eventService;

    public FavoriteController(FavoriteService favoriteService, EventService eventService) {
        this.favoriteService = favoriteService;
        this.eventService = eventService;
    }

    @PostMapping("/{userId}/{eventId}")
    public ResponseEntity<Void> addFavorite(@PathVariable Long userId, @PathVariable Long eventId) {
        favoriteService.markFavorite(userId, eventId);

        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{userId}/{eventId}")
    public ResponseEntity<Void> removeFavorite(@PathVariable Long userId, @PathVariable Long eventId) {
        favoriteService.removeFavorite(userId, eventId);

        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{userId}")
    public ResponseEntity<List<EventResponseDTO>> listFavorites(@PathVariable Long userId) {
        List<Event> events = favoriteService.getFavorites(userId);
        List<EventResponseDTO> dtos = events
                .stream()
                .map(eventService::mapToDTO)
                .toList();

        return ResponseEntity.ok(dtos);
    }
}
