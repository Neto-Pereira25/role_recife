package br.recife.eventos.eventos_api.repositories.event;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import br.recife.eventos.eventos_api.models.entities.Event;

public interface EventRepository extends JpaRepository<Event, Long> {
    List<Event> findByNameContainingIgnoreCase(String name);
}
