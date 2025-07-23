package br.recife.eventos.eventos_api.repositories.chat;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import br.recife.eventos.eventos_api.models.entities.Chat;
import br.recife.eventos.eventos_api.models.entities.CommonUser;
import br.recife.eventos.eventos_api.models.entities.EventOwnerUser;

public interface ChatRepository extends JpaRepository<Chat, Long> {
    Optional<Chat> findByCommonUserAndOwnerUser(CommonUser user, EventOwnerUser ownerUser);

    List<Chat> findByCommonUserIdOrOwnerUserId(Long commonUserId, Long ownerUserId);

    List<Chat> findByCommonUser(CommonUser user);

    List<Chat> findByOwnerUser(EventOwnerUser user);
}
