package br.recife.eventos.eventos_api.services;

import java.util.Optional;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import br.recife.eventos.eventos_api.dto.user.CommonUserRegisterDTO;
import br.recife.eventos.eventos_api.dto.user.EventOwnerRegisterDTO;
import br.recife.eventos.eventos_api.exceptions.DuplicateResourceException;
import br.recife.eventos.eventos_api.exceptions.ResourceNotFoundException;
import br.recife.eventos.eventos_api.models.entities.CommonUser;
import br.recife.eventos.eventos_api.models.entities.EventOwnerUser;
import br.recife.eventos.eventos_api.models.entities.User;
import br.recife.eventos.eventos_api.models.entities.User.UsersType;
import br.recife.eventos.eventos_api.repositories.user.CommonUserRepository;
import br.recife.eventos.eventos_api.repositories.user.EventOwnerUserRepository;
import br.recife.eventos.eventos_api.repositories.user.UserRepository;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final CommonUserRepository commonUserRepository;
    private final EventOwnerUserRepository eventOwnerUserRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, CommonUserRepository commonUserRepository,
            EventOwnerUserRepository eventOwnerUserRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.commonUserRepository = commonUserRepository;
        this.eventOwnerUserRepository = eventOwnerUserRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public CommonUser registerCommonUser(CommonUserRegisterDTO userDto) {
        validateUniqueEmail(userDto.getEmail());

        CommonUser user = new CommonUser();
        user.setName(userDto.getName());
        user.setEmail(userDto.getEmail());
        user.setPassword(passwordEncoder.encode(userDto.getPassword()));
        user.setNeighborhood(userDto.getNeighborhood());
        user.setType(UsersType.COMMON_USER);

        return commonUserRepository.save(user);
    }

    public EventOwnerUser registerEventOwnerUser(EventOwnerRegisterDTO userDto) {
        validateUniqueEmail(userDto.getEmail());

        EventOwnerUser user = new EventOwnerUser();
        user.setName(userDto.getName());
        user.setEmail(userDto.getEmail());
        user.setPassword(passwordEncoder.encode(userDto.getPassword()));
        user.setCpfCnpj(userDto.getCpfCnpj());
        user.setType(UsersType.EVENT_OWNER_USER);

        return eventOwnerUserRepository.save(user);
    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public User findById(Long id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário não encontrado."));
    }

    private void validateUniqueEmail(String email) {
        if (userRepository.findByEmail(email).isPresent()) {
            throw new DuplicateResourceException("Email já cadastrado no sistema.");
        }
    }
}
