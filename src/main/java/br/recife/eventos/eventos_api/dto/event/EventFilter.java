package br.recife.eventos.eventos_api.dto.event;

import java.time.LocalDateTime;

import br.recife.eventos.eventos_api.models.entities.Event.EventType;
import br.recife.eventos.eventos_api.models.entities.Event.SpaceType;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EventFilter {
    private EventType type;
    private SpaceType spaceType;
    private LocalDateTime dateAfter;
    private String location;
    private String query;
}
