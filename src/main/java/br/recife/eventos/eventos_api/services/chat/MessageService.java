package br.recife.eventos.eventos_api.services.chat;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import br.recife.eventos.eventos_api.models.entities.Chat;
import br.recife.eventos.eventos_api.models.entities.Message;
import br.recife.eventos.eventos_api.models.entities.User;
import br.recife.eventos.eventos_api.repositories.chat.MessageRepository;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MessageService {

    private final MessageRepository messageRepository;

    public Message sendMessage(Chat chat, User sender, String content) {
        Message message = new Message();
        message.setChat(chat);
        message.setChat(chat);
        message.setSender(sender);
        message.setContent(content);
        message.setSentAt(LocalDateTime.now());

        return messageRepository.save(message);
    }

    public List<Message> getMessageFromChat(Chat chat) {
        return messageRepository.findByChatOrderBySentAtAsc(chat);
    }
}
