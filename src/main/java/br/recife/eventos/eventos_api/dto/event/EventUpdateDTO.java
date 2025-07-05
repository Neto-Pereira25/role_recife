package br.recife.eventos.eventos_api.dto.event;

import java.time.LocalDateTime;
import java.util.List;

import br.recife.eventos.eventos_api.models.entities.Event.EventType;
import br.recife.eventos.eventos_api.models.entities.Event.Periodicity;
import br.recife.eventos.eventos_api.models.entities.Event.SpaceType;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class EventUpdateDTO {

    @NotBlank
    private String name;

    private String description;
    private String location;
    private LocalDateTime dateTime;
    private String ageRating;
    private EventType eventType;
    private SpaceType spaceType;
    private Periodicity periodicity;
    private int capacity;
    private String ticketLink;
    private List<String> imageUrls;
    private List<String> attractions;
    private List<String> tags;
}
