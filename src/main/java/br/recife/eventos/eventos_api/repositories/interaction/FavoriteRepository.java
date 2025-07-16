package br.recife.eventos.eventos_api.repositories.interaction;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import br.recife.eventos.eventos_api.models.entities.CommonUser;
import br.recife.eventos.eventos_api.models.entities.Event;
import br.recife.eventos.eventos_api.models.entities.Favorite;

public interface FavoriteRepository extends JpaRepository<Favorite, Long> {
    boolean existsByUserAndEvent(CommonUser user, Event event);

    Optional<Favorite> findByUserAndEvent(CommonUser user, Event event);

    List<Favorite> findByUser(CommonUser user);

    List<Favorite> findByEvent(Event event);
}
