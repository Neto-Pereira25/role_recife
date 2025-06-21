package br.recife.eventos.eventos_api.model.entities;

import java.time.LocalDateTime;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "events")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column
    private String name;

    @Column
    private String description;

    @Column
    private String location;

    @Column
    private LocalDateTime dateHour;

    @Column
    private String ageGroup;

    @Enumerated(EnumType.STRING)
    private Periodicity periodicity;

    @Enumerated(EnumType.STRING)
    private SpaceType spaceType;

    @Column
    private Integer capacity;

    @Enumerated(EnumType.STRING)
    private EventType eventType;

    private String ticketLink;

    @ManyToOne
    @JoinColumn(name = "id_dono")
    private EventOwnerUser ownerUser;

    @OneToMany(mappedBy = "event", cascade = CascadeType.ALL)
    private List<Attraction> attractions;

    @OneToMany(mappedBy = "event", cascade = CascadeType.ALL)
    private List<EventImage> images;

    public enum Periodicity {
        SINGLE_EVENT,
        WEEKLY_EVENT,
        MONTHLY_EVENT
    }

    public enum SpaceType {
        OPEN, CLOSE
    }

    public enum EventType {
        FREE_EVENT, PAID_EVENT
    }
}
