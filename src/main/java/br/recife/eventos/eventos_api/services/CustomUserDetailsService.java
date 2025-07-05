package br.recife.eventos.eventos_api.services;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import br.recife.eventos.eventos_api.models.entities.User;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserService userService;

    public CustomUserDetailsService(UserService userService) {
        this.userService = userService;
    }

    @Override
    public UserDetails loadUserByUsername(String subject) throws UsernameNotFoundException {
        try {
            // Esperado: "8-EVENT_OWNER_USER"
            Long userId = Long.valueOf(subject.split("-")[0]);
            User user = userService.findById(userId); // já lança ResourceNotFoundException se não achar

            return org.springframework.security.core.userdetails.User
                    .withUsername(String.valueOf(user.getId()))
                    .password(user.getPassword())
                    .roles(user.getType().name())
                    .build();

        } catch (Exception e) {
            throw new UsernameNotFoundException("Usuário não encontrado: " + subject);
        }
    }

}
