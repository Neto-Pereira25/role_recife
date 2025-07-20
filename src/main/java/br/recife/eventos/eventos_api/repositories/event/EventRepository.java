package br.recife.eventos.eventos_api.repositories.event;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import br.recife.eventos.eventos_api.models.entities.Event;

public interface EventRepository extends JpaRepository<Event, Long>, JpaSpecificationExecutor<Event> {
    List<Event> findByNameContainingIgnoreCase(String name);

    List<Event> findByOwnerUserId(Long ownerId);

    @Query("""
                SELECT e FROM Event e
                JOIN e.tags t
                WHERE LOWER(t) LIKE LOWER(CONCAT('%', :tag, '%'))
            """)
    List<Event> findByTagLike(@Param("tag") String tag);
}
