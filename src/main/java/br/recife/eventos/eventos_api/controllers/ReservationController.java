package br.recife.eventos.eventos_api.controllers;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.recife.eventos.eventos_api.dto.event.CreateReservationDTO;
import br.recife.eventos.eventos_api.dto.event.ReservationResponseDTO;
import br.recife.eventos.eventos_api.models.entities.CommonUser;
import br.recife.eventos.eventos_api.models.entities.Event;
import br.recife.eventos.eventos_api.models.entities.Reservation;
import br.recife.eventos.eventos_api.models.entities.User;
import br.recife.eventos.eventos_api.repositories.event.EventRepository;
import br.recife.eventos.eventos_api.services.ReservationService;
import br.recife.eventos.eventos_api.services.UserService;

@RestController
@RequestMapping("/api/reservations")
@CrossOrigin(origins = "http://localhost:5500")
public class ReservationController {

    @Autowired
    private ReservationService reservationService;

    @Autowired
    private UserService userService;

    @Autowired
    private EventRepository eventRepository;

    @PostMapping
    public ResponseEntity<?> reserve(@RequestBody CreateReservationDTO dto) {
        User u = userService.findById(dto.getUserId());

        Optional<CommonUser> userOpt = null;
        if (u instanceof CommonUser) {
            userOpt = Optional.ofNullable((CommonUser) u);
        }

        Optional<Event> eventOpt = eventRepository.findById(dto.getEventId());

        if (userOpt.isEmpty() || eventOpt.isEmpty()) {
            System.out.println("Usuário: " + userOpt);
            System.out.println("Evento: " + eventOpt);

            return ResponseEntity.badRequest().body("Usuário ou evento não encontrado");
        }

        try {
            Reservation reservation = reservationService.reserveSpot(userOpt.get(), eventOpt.get());

            return ResponseEntity.ok(new ReservationResponseDTO(
                    reservation.getId(),
                    reservation.getEvent().getId(),
                    reservation.getEvent().getName(),
                    reservation.getUser().getId(),
                    reservation.getReservedAt().format(DateTimeFormatter.ofPattern("dd/MM/yyyy"))));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/event/{eventId}/count")
    public ResponseEntity<?> getReservationCount(@PathVariable Long eventId) {
        Optional<Event> eventOpt = eventRepository.findById(eventId);
        if (eventOpt.isEmpty())
            return ResponseEntity.badRequest().body("Evento não encontrado");

        Long count = reservationService.countReservationsByEvent(eventOpt.get());
        return ResponseEntity.ok(count);
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<?> getUserReservations(@PathVariable Long userId) {
        User u = userService.findById(userId);

        Optional<CommonUser> userOpt = null;
        if (u instanceof CommonUser) {
            userOpt = Optional.ofNullable((CommonUser) u);
        }

        if (userOpt.isEmpty())
            return ResponseEntity.badRequest().body("Usuário não encontrado.");

        List<ReservationResponseDTO> response = reservationService
                .getUserReservations(userOpt.get())
                .stream()
                .map(r -> new ReservationResponseDTO(
                        r.getId(),
                        r.getEvent().getId(),
                        r.getEvent().getName(),
                        r.getUser().getId(),
                        r.getReservedAt().format(DateTimeFormatter.ofPattern("dd/MM/yyyy"))))
                .collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }
}
