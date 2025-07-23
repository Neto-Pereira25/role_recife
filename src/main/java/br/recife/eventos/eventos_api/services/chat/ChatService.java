package br.recife.eventos.eventos_api.services.chat;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import br.recife.eventos.eventos_api.models.entities.Chat;
import br.recife.eventos.eventos_api.models.entities.CommonUser;
import br.recife.eventos.eventos_api.models.entities.EventOwnerUser;
import br.recife.eventos.eventos_api.repositories.chat.ChatRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final ChatRepository chatRepository;

    public Chat getOrCreateChat(CommonUser commonUser, EventOwnerUser eventOwnerUser) {
        return chatRepository.findByCommonUserAndOwnerUser(commonUser, eventOwnerUser)
                .orElseGet(() -> {
                    Chat chat = new Chat();
                    chat.setCommonUser(commonUser);
                    chat.setOwnerUser(eventOwnerUser);
                    chat.setCreatedAt(LocalDateTime.now());
                    return chatRepository.save(chat);
                });
    }

    public List<Chat> getChatByCommonUser(CommonUser commonUser) {
        return chatRepository.findByCommonUser(commonUser);
    }

    public List<Chat> getChatByOwnerUser(EventOwnerUser eventOwnerUser) {
        return chatRepository.findByOwnerUser(eventOwnerUser);
    }

    public Chat getChatById(Long id) {
        return chatRepository.findById(id).orElse(null);
    }
}
