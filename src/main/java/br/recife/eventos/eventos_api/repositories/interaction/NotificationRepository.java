package br.recife.eventos.eventos_api.repositories.interaction;

import org.springframework.data.jpa.repository.JpaRepository;

import br.recife.eventos.eventos_api.models.entities.Notification;

public interface NotificationRepository extends JpaRepository<Notification, Long> {

}
