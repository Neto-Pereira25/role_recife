package br.recife.eventos.eventos_api.dto.event;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class ReservationResponseDTO {
    private Long reservationId;
    private Long eventId;
    private String eventName;
    private Long userId;
    private String reservedAt;
}
