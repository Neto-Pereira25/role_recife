package br.recife.eventos.eventos_api.repositories.specification;

import java.util.ArrayList;
import java.util.List;

import org.springframework.data.jpa.domain.Specification;

import br.recife.eventos.eventos_api.dto.event.EventFilter;
import br.recife.eventos.eventos_api.models.entities.Event;
import jakarta.persistence.criteria.Predicate;

public class EventSpecification {

    public static Specification<Event> withFilters(EventFilter filter) {
        return (root, query, builder) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (filter.getType() != null) {
                predicates.add(builder.equal(root.get("eventType"), filter.getType()));
            }

            if (filter.getSpaceType() != null) {
                predicates.add(builder.equal(root.get("spaceType"), filter.getSpaceType()));
            }

            if (filter.getDateAfter() != null) {
                predicates.add(builder.greaterThanOrEqualTo(root.get("dateHour"), filter.getDateAfter()));
            }

            if (filter.getLocation() != null && !filter.getLocation().isBlank()) {
                predicates.add(builder.like(builder.lower(root.get("location")),
                        "%" + filter.getLocation().toLowerCase() + "%"));
            }

            if (filter.getQuery() != null && !filter.getQuery().isBlank()) {
                Predicate inName = builder.like(builder.lower(root.get("name")),
                        "%" + filter.getQuery().toLowerCase() + "%");
                Predicate inDescription = builder.like(builder.lower(root.get("description")),
                        "%" + filter.getQuery().toLowerCase() + "%");
                Predicate inTags = builder.isMember(filter.getQuery().toLowerCase(), root.get("tags"));

                predicates.add(builder.or(inName, inDescription, inTags));
            }

            return builder.and(predicates.toArray(new Predicate[0]));
        };
    }
}
