package br.recife.eventos.eventos_api.dto.chat;

import lombok.Data;

@Data
public class MessageDTO {
    private Long id;
    private Long chatId;
    private Long senderId;
    private String content;
    private String sentAt;
}
