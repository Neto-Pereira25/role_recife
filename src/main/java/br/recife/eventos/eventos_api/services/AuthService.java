package br.recife.eventos.eventos_api.services;

import java.util.Optional;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import br.recife.eventos.eventos_api.config.JwtTokenUtil;
import br.recife.eventos.eventos_api.dto.user.LoginRequestDTO;
import br.recife.eventos.eventos_api.dto.user.LoginResponseDTO;
import br.recife.eventos.eventos_api.exceptions.InvalidCredentialsException;
import br.recife.eventos.eventos_api.models.entities.User;
import br.recife.eventos.eventos_api.repositories.user.UserRepository;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenUtil jwtTokenUtil;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder, JwtTokenUtil jwtTokenUtil) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenUtil = jwtTokenUtil;
    }

    public LoginResponseDTO authenticate(LoginRequestDTO loginRequest) {
        Optional<User> userOpt = userRepository.findByEmail(loginRequest.getEmail());

        if (userOpt.isEmpty() || !passwordEncoder.matches(loginRequest.getPassword(), userOpt.get().getPassword())) {
            throw new InvalidCredentialsException("Email ou Senha Inválidos.");
        }

        User user = userOpt.get();
        String token = jwtTokenUtil.generateToken(user.getId() + "-" + user.getType().name());

        return new LoginResponseDTO(token, user.getType().name(), user.getId(), user.getName(), user.getEmail());
    }
}
