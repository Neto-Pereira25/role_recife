package br.recife.eventos.eventos_api.controllers.chat;

import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.recife.eventos.eventos_api.dto.chat.CreateMessageDTO;
import br.recife.eventos.eventos_api.dto.chat.MessageDTO;
import br.recife.eventos.eventos_api.models.entities.Chat;
import br.recife.eventos.eventos_api.models.entities.Message;
import br.recife.eventos.eventos_api.models.entities.User;
import br.recife.eventos.eventos_api.services.UserService;
import br.recife.eventos.eventos_api.services.chat.ChatService;
import br.recife.eventos.eventos_api.services.chat.MessageService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/messages")
@CrossOrigin(origins = "http://localhost:5500")
@RequiredArgsConstructor
public class MessageController {

    private final MessageService messageService;
    private final ChatService chatService;
    private final UserService userService;

    @PostMapping("/send")
    public ResponseEntity<?> sendMessage(@RequestBody CreateMessageDTO dto) {
        try {
            Chat chat = chatService.getChatById(dto.getChatId());
            User sender = userService.findById(dto.getSenderId());

            Message message = messageService.sendMessage(chat, sender, dto.getContent());

            MessageDTO response = new MessageDTO();
            response.setId(message.getId());
            response.setChatId(chat.getId());
            response.setSenderId(sender.getId());
            response.setContent(message.getContent());
            response.setSentAt(message.getSentAt().toString());

            return ResponseEntity.ok().body(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e);
        }
    }

    @GetMapping("/{chatId}")
    public ResponseEntity<?> getMessages(@PathVariable Long chatId) {
        try {
            Chat chat = chatService.getChatById(chatId);
            return ResponseEntity.ok().body(messageService.getMessageFromChat(chat).stream().map(message -> {
                MessageDTO dto = new MessageDTO();
                dto.setId(message.getId());
                dto.setChatId(message.getChat().getId());
                dto.setSenderId(message.getSender().getId());
                dto.setContent(message.getContent());
                dto.setSentAt(message.getSentAt().toString());
                return dto;
            }).collect(Collectors.toList()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e);
        }
    }
}
