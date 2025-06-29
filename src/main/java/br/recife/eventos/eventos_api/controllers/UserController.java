package br.recife.eventos.eventos_api.controllers;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.recife.eventos.eventos_api.dto.user.CommonUserRegisterDTO;
import br.recife.eventos.eventos_api.dto.user.EventOwnerRegisterDTO;
import br.recife.eventos.eventos_api.models.entities.CommonUser;
import br.recife.eventos.eventos_api.models.entities.EventOwnerUser;
import br.recife.eventos.eventos_api.services.UserService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register/common")
    public ResponseEntity<CommonUser> registerCommonUser(
            @Valid @RequestBody CommonUserRegisterDTO userDto) {
        CommonUser createdUser = userService.registerCommonUser(userDto);
        return new ResponseEntity<>(createdUser, HttpStatus.CREATED);
    }

    @PostMapping("/register/owner")
    public ResponseEntity<EventOwnerUser> registerEventOwner(
            @Valid @RequestBody EventOwnerRegisterDTO userDto) {
        EventOwnerUser createdOwnerUser = userService.registerEventOwnerUser(userDto);
        return new ResponseEntity<>(createdOwnerUser, HttpStatus.CREATED);
    }
}
