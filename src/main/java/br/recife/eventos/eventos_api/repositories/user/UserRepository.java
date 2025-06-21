package br.recife.eventos.eventos_api.repositories.user;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import br.recife.eventos.eventos_api.models.entities.User;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
}
