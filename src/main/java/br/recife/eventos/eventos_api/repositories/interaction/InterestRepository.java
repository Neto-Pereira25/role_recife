package br.recife.eventos.eventos_api.repositories.interaction;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import br.recife.eventos.eventos_api.models.entities.CommonUser;
import br.recife.eventos.eventos_api.models.entities.Interest;

public interface InterestRepository extends JpaRepository<Interest, Long> {
    List<Interest> findByUser(CommonUser user);
}
