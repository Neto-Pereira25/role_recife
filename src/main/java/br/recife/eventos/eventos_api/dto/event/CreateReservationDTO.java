package br.recife.eventos.eventos_api.dto.event;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CreateReservationDTO {
    private Long userId;
    private Long eventId;
}
