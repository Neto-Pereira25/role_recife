package br.recife.eventos.eventos_api.controllers.chat;

import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import br.recife.eventos.eventos_api.dto.chat.ChatDTO;
import br.recife.eventos.eventos_api.models.entities.Chat;
import br.recife.eventos.eventos_api.models.entities.CommonUser;
import br.recife.eventos.eventos_api.models.entities.EventOwnerUser;
import br.recife.eventos.eventos_api.services.UserService;
import br.recife.eventos.eventos_api.services.chat.ChatService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;
    private final UserService userService;

    @PostMapping("/start")
    public ResponseEntity<?> startChat(@RequestParam Long commonUserId, @RequestParam Long ownerUserId) {
        try {
            CommonUser commonUser = (CommonUser) userService.findById(commonUserId);
            EventOwnerUser ownerUser = (EventOwnerUser) userService.findById(ownerUserId);
            Chat chat = chatService.getOrCreateChat(commonUser, ownerUser);

            ChatDTO dto = new ChatDTO();
            dto.setId(chat.getId());
            dto.setCommonUserId(commonUserId);
            dto.setOwnerUserId(ownerUserId);
            dto.setCreatedAt(chat.getCreatedAt().toString());

            return ResponseEntity.ok().body(dto);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e);
        }
    }

    @GetMapping("/common/{userId}")
    public ResponseEntity<?> getChatsByCommonUser(@PathVariable Long userId) {
        try {
            CommonUser commonUser = (CommonUser) userService.findById(userId);
            return ResponseEntity.ok().body(chatService.getChatByCommonUser(commonUser).stream().map(chat -> {
                ChatDTO dto = new ChatDTO();
                dto.setId(chat.getId());
                dto.setCommonUserId(chat.getCommonUser().getId());
                dto.setOwnerUserId(chat.getOwnerUser().getId());
                dto.setCreatedAt(chat.getCreatedAt().toString());
                return dto;
            }).collect(Collectors.toList()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e);
        }
    }

    @GetMapping("/owner/{userId}")
    public ResponseEntity<?> getChatsByOwnerUser(@PathVariable Long userId) {
        try {
            EventOwnerUser user = (EventOwnerUser) userService.findById(userId);
            return ResponseEntity.ok().body(chatService.getChatByOwnerUser(user).stream().map(chat -> {
                ChatDTO dto = new ChatDTO();
                dto.setId(chat.getId());
                dto.setCommonUserId(chat.getCommonUser().getId());
                dto.setOwnerUserId(chat.getOwnerUser().getId());
                dto.setCreatedAt(chat.getCreatedAt().toString());
                return dto;
            }).collect(Collectors.toList()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e);
        }
    }
}