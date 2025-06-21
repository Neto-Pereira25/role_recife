package br.recife.eventos.eventos_api.repositories.user;

import org.springframework.data.jpa.repository.JpaRepository;

import br.recife.eventos.eventos_api.models.entities.CommonUser;

public interface CommonUserRepository extends JpaRepository<CommonUser, Long> {

}
