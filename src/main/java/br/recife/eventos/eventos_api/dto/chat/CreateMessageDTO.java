package br.recife.eventos.eventos_api.dto.chat;

import lombok.Data;

@Data
public class CreateMessageDTO {
    private Long chatId;
    private Long senderId;
    private String content;
}
