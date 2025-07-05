package br.recife.eventos.eventos_api.services;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import br.recife.eventos.eventos_api.dto.event.EventCreateDTO;
import br.recife.eventos.eventos_api.dto.event.EventFilter;
import br.recife.eventos.eventos_api.dto.event.EventResponseDTO;
import br.recife.eventos.eventos_api.exceptions.ResourceNotFoundException;
import br.recife.eventos.eventos_api.models.entities.Attraction;
import br.recife.eventos.eventos_api.models.entities.Event;
import br.recife.eventos.eventos_api.models.entities.Event.EventType;
import br.recife.eventos.eventos_api.models.entities.EventImage;
import br.recife.eventos.eventos_api.models.entities.EventOwnerUser;
import br.recife.eventos.eventos_api.repositories.auxiliary.AttractionRepository;
import br.recife.eventos.eventos_api.repositories.auxiliary.EventImageRepository;
import br.recife.eventos.eventos_api.repositories.event.EventRepository;
import br.recife.eventos.eventos_api.repositories.specification.EventSpecification;
import br.recife.eventos.eventos_api.repositories.user.EventOwnerUserRepository;

@Service
public class EventService {

    private final EventRepository eventRepository;
    private final EventOwnerUserRepository eventOwnerUserRepository;
    private final AttractionRepository attractionRepository;
    private final EventImageRepository eventImageRepository;

    public EventService(EventRepository eventRepository, EventOwnerUserRepository eventOwnerUserRepository,
            AttractionRepository attractionRepository, EventImageRepository eventImageRepository) {
        this.eventRepository = eventRepository;
        this.eventOwnerUserRepository = eventOwnerUserRepository;
        this.attractionRepository = attractionRepository;
        this.eventImageRepository = eventImageRepository;
    }

    public Event createEvent(EventCreateDTO eventDto) {
        Long ownerId = getAuthenticatedUserId();
        EventOwnerUser ownerUser = eventOwnerUserRepository.findById(ownerId)
                .orElseThrow(() -> new ResourceNotFoundException("Dono do evento não encontrado"));

        if (eventDto.getEventType() == EventType.PAID_EVENT && (eventDto.getTicketLink() == null)) {
            throw new IllegalArgumentException("Eventos pagos devem ter um link de pagamento");
        }

        if (eventDto.getImageUrls() != null && eventDto.getImageUrls().size() > 5) {
            throw new IllegalArgumentException("Você só pode armazenar 5 imagens");
        }

        Event event = new Event();
        event.setName(eventDto.getName());
        event.setDescription(eventDto.getDescription());
        event.setLocation(eventDto.getLocation());
        event.setDateHour(eventDto.getDateTime());
        event.setAgeGroup(eventDto.getAgeRating());
        event.setEventType(eventDto.getEventType());
        event.setSpaceType(eventDto.getSpaceType());
        event.setCapacity(eventDto.getCapacity());
        event.setPeriodicity(eventDto.getPeriodicity());
        event.setTicketLink(eventDto.getTicketLink());
        event.setTags(eventDto.getTags());
        event.setOwnerUser(ownerUser);

        event = eventRepository.save(event);

        if (eventDto.getAttractions() != null) {
            List<Attraction> savedAttracions = new ArrayList<>();
            for (String name : eventDto.getAttractions()) {
                Attraction attraction = new Attraction();
                attraction.setName(name);
                attraction.setEvent(event);
                savedAttracions.add(attraction);
            }
            attractionRepository.saveAll(savedAttracions);
        }

        if (eventDto.getImageUrls() != null) {
            List<EventImage> savedImages = new ArrayList<>();
            for (String url : eventDto.getImageUrls()) {
                EventImage image = new EventImage();
                image.setUrl(url);
                image.setEvent(event);
                savedImages.add(image);
            }
            eventImageRepository.saveAll(savedImages);
        }

        return event;
    }

    public List<EventResponseDTO> listAllEvents() {
        List<Event> events = eventRepository.findAll();

        return events.stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public EventResponseDTO mapToDTO(Event event) {
        return EventResponseDTO.builder()
                .id(event.getId())
                .name(event.getName())
                .description(event.getDescription())
                .location(event.getLocation())
                .dateHour(event.getDateHour())
                .ageGroup(event.getAgeGroup())
                .eventType(event.getEventType())
                .spaceType(event.getSpaceType())
                .periodicity(event.getPeriodicity())
                .capacity(event.getCapacity())
                .ticketLink(event.getTicketLink())
                .tags(event.getTags())
                .imageUrls(event.getImages().stream().map(EventImage::getUrl).toList())
                .attractions(event.getAttractions().stream().map(Attraction::getName).toList())
                .ownerName(event.getOwnerUser().getName())
                .build();
    }

    public EventResponseDTO getEventById(Long id) {
        Event event = eventRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Evento não encontrado com id: " + id));

        return mapToDTO(event);
    }

    public List<EventResponseDTO> searchEvents(EventFilter filter) {
        Specification<Event> spec = EventSpecification.withFilters(filter);
        List<Event> results = eventRepository.findAll(spec);

        return results.stream()
                .map(this::mapToDTO)
                .toList();
    }

    private Long getAuthenticatedUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String subject = authentication.getName();
        String[] parts = subject.split("-");
        return Long.parseLong(parts[0]);
    }
}
