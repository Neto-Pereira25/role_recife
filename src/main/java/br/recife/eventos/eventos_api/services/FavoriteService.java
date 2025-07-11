package br.recife.eventos.eventos_api.services;

import java.util.List;

import org.springframework.stereotype.Service;

import br.recife.eventos.eventos_api.exceptions.ResourceNotFoundException;
import br.recife.eventos.eventos_api.models.entities.CommonUser;
import br.recife.eventos.eventos_api.models.entities.Event;
import br.recife.eventos.eventos_api.models.entities.Favorite;
import br.recife.eventos.eventos_api.repositories.event.EventRepository;
import br.recife.eventos.eventos_api.repositories.interaction.FavoriteRepository;
import br.recife.eventos.eventos_api.repositories.user.CommonUserRepository;

@Service
public class FavoriteService {

        private final FavoriteRepository favoriteRepository;
        private final EventRepository eventRepository;
        private final CommonUserRepository userRepository;

        public FavoriteService(FavoriteRepository favoriteRepository, EventRepository eventRepository,
                        CommonUserRepository userRepository) {
                this.favoriteRepository = favoriteRepository;
                this.eventRepository = eventRepository;
                this.userRepository = userRepository;
        }

        public void markFavorite(Long userId, Long eventId) {
                CommonUser user = userRepository.findById(userId)
                                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado"));

                Event event = eventRepository.findById(eventId)
                                .orElseThrow(() -> new ResourceNotFoundException("Evento não encontrado"));

                if (favoriteRepository.existsByUserAndEvent(user, event)) {
                        throw new IllegalStateException("Usuário já favoritou esse evento.");
                }

                Favorite favorite = new Favorite();
                favorite.setUser(user);
                favorite.setEvent(event);
                favoriteRepository.save(favorite);
        }

        public List<Event> getFavorites(Long userId) {
                CommonUser user = userRepository.findById(userId)
                                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado"));

                return favoriteRepository.findByUser(user)
                                .stream()
                                .map(Favorite::getEvent)
                                .toList();
        }

        public void removeFavorite(Long userId, Long eventId) {
                CommonUser user = userRepository.findById(userId)
                                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado."));
                Event event = eventRepository.findById(eventId)
                                .orElseThrow(() -> new ResourceNotFoundException("Evento não encontrado."));

                Favorite favorite = favoriteRepository.findByUserAndEvent(user, event)
                                .orElseThrow(() -> new ResourceNotFoundException("Evento Favorito não encontrado."));

                favoriteRepository.delete(favorite);
        }

}
