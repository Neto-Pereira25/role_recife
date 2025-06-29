package br.recife.eventos.eventos_api.dto.event;

import java.time.LocalDateTime;
import java.util.List;

import br.recife.eventos.eventos_api.models.entities.Event.EventType;
import br.recife.eventos.eventos_api.models.entities.Event.Periodicity;
import br.recife.eventos.eventos_api.models.entities.Event.SpaceType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class EventResponseDTO {

    private Long id;
    private String name;
    private String description;
    private String location;
    private LocalDateTime dateHour;
    private String ageGroup;
    private EventType eventType;
    private SpaceType spaceType;
    private Periodicity periodicity;
    private Integer capacity;
    private String ticketLink;

    private List<String> imageUrls;
    private List<String> attractions;
    private List<String> tags;

    private String ownerName;
}
