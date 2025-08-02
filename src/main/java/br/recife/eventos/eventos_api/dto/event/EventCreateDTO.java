package br.recife.eventos.eventos_api.dto.event;

import java.time.LocalDateTime;
import java.util.List;

import br.recife.eventos.eventos_api.models.entities.Event.EventType;
import br.recife.eventos.eventos_api.models.entities.Event.Periodicity;
import br.recife.eventos.eventos_api.models.entities.Event.SpaceType;
import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EventCreateDTO {

    @NotBlank(message = "Nome do evento é requerido.")
    private String name;

    @NotBlank(message = "Descrição do evento é requerida.")
    private String description;

    @NotBlank(message = "Local do evento é requerido.")
    private String location;

    @Future(message = "A data do evento deve estar no futuro.")
    @NotNull(message = "Data e hora são requeridos.")
    private LocalDateTime dateTime;

    @NotBlank(message = "Faixa etária é requerida.")
    private String ageRating;

    @NotNull(message = "O tipo do evento é requerido (FREE or PAID).")
    private EventType eventType;

    @NotNull(message = "Tipo do espaço é requerido (OPEN or CLOSED).")
    private SpaceType spaceType;

    @Positive(message = "Capacidade deve ser um número positivo.")
    private int capacity;

    @NotNull(message = "Periodicidade é requerida.")
    private Periodicity periodicity;

    private String ticketLink;

    private List<String> tags;

    private List<String> attractions;

    private List<String> imageUrls;

    @NotNull(message = "Você deve informar se o evento aceita reserva de vaga.")
    private Boolean allowReservation;
}
