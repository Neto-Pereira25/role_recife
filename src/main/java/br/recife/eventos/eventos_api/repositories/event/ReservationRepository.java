package br.recife.eventos.eventos_api.repositories.event;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import br.recife.eventos.eventos_api.models.entities.CommonUser;
import br.recife.eventos.eventos_api.models.entities.Event;
import br.recife.eventos.eventos_api.models.entities.Reservation;

public interface ReservationRepository extends JpaRepository<Reservation, Long> {
    Optional<Reservation> findByUserAndEvent(CommonUser user, Event event);

    Long countByEvent(Event event);

    List<Reservation> findAllByUser(CommonUser user);

    List<Reservation> findAllByEvent(Event event);
}
