package br.recife.eventos.eventos_api.dto.event;

import java.time.LocalDateTime;
import java.util.List;

import br.recife.eventos.eventos_api.models.entities.Attraction;
import br.recife.eventos.eventos_api.models.entities.Event;
import br.recife.eventos.eventos_api.models.entities.EventImage;
import br.recife.eventos.eventos_api.models.entities.Reservation;
import br.recife.eventos.eventos_api.models.entities.Event.EventType;
import br.recife.eventos.eventos_api.models.entities.Event.Periodicity;
import br.recife.eventos.eventos_api.models.entities.Event.SpaceType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class EventResponseDTO {

    private Long id;
    private Long ownerId;
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
    private Boolean allowReservation;
    private List<Reservation> reservations;

    private String ownerName;

    public static EventResponseDTO fromEntity(Event event) {
        EventResponseDTO dto = new EventResponseDTO();
        dto.setId(event.getId());
        dto.setName(event.getName());
        dto.setDescription(event.getDescription());
        dto.setLocation(event.getLocation());
        dto.setDateHour(event.getDateHour());
        dto.setAgeGroup(event.getAgeGroup());
        dto.setEventType(event.getEventType());
        dto.setSpaceType(event.getSpaceType());
        dto.setPeriodicity(event.getPeriodicity());
        dto.setCapacity(event.getCapacity());
        dto.setTicketLink(event.getTicketLink());
        dto.setImageUrls(event.getImages().stream().map(EventImage::getUrl).toList());
        dto.setAttractions(event.getAttractions().stream().map(Attraction::getName).toList());
        dto.setTags(event.getTags());
        dto.setAllowReservation(event.isReservable());
        dto.setReservations(event.getReservations());

        return dto;
    }
}
