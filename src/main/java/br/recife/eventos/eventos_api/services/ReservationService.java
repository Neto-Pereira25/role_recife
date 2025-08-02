package br.recife.eventos.eventos_api.services;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import br.recife.eventos.eventos_api.models.entities.CommonUser;
import br.recife.eventos.eventos_api.models.entities.Event;
import br.recife.eventos.eventos_api.models.entities.Reservation;
import br.recife.eventos.eventos_api.repositories.event.ReservationRepository;

@Service
public class ReservationService {

    @Autowired
    private ReservationRepository reservationRepository;

    public boolean isEventFull(Event event) {
        Long currentReservation = reservationRepository.countByEvent(event);
        return currentReservation >= event.getCapacity();
    }

    public boolean hasUserReserved(CommonUser user, Event event) {
        return reservationRepository.findByUserAndEvent(user, event).isPresent();
    }

    public Reservation reserveSpot(CommonUser user, Event event) throws Exception {
        if (hasUserReserved(user, event)) {
            throw new Exception("Usuário já reservou vaga nesse evento.");
        }

        if (!event.isReservable()) {
            throw new Exception("Este evento não permite reservas.");
        }

        if (isEventFull(event)) {
            throw new Exception("Capacidade máxima atingida.");
        }

        Reservation reservation = new Reservation();
        reservation.setUser(user);
        reservation.setEvent(event);
        reservation.setReservedAt(LocalDateTime.now());

        return reservationRepository.save(reservation);
    }

    public List<Reservation> getUserReservations(CommonUser user) {
        return reservationRepository.findAllByUser(user);
    }

    public List<Reservation> getEventReservations(Event event) {
        return reservationRepository.findAllByEvent(event);
    }

    public Long countReservationsByEvent(Event event) {
        return reservationRepository.countByEvent(event);
    }
}
