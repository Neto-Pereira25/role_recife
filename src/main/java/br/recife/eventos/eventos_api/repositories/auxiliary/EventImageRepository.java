package br.recife.eventos.eventos_api.repositories.auxiliary;

import org.springframework.data.jpa.repository.JpaRepository;

import br.recife.eventos.eventos_api.models.entities.EventImage;

public interface EventImageRepository extends JpaRepository<EventImage, Long> {

}
