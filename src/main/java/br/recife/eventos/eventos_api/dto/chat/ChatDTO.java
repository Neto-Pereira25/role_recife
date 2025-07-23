package br.recife.eventos.eventos_api.dto.chat;

import lombok.Data;

@Data
public class ChatDTO {
    private Long id;
    private Long commonUserId;
    private Long ownerUserId;
    private String createdAt;
}
