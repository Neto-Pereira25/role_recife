package br.recife.eventos.eventos_api.controllers;

import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import br.recife.eventos.eventos_api.dto.user.CommonUserRegisterDTO;
import br.recife.eventos.eventos_api.dto.user.EventOwnerRegisterDTO;
import br.recife.eventos.eventos_api.exceptions.DuplicateResourceException;
import br.recife.eventos.eventos_api.models.entities.CommonUser;
import br.recife.eventos.eventos_api.models.entities.EventOwnerUser;
import br.recife.eventos.eventos_api.services.UserService;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:5500")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register/common")
    public ResponseEntity<?> registerCommonUser(
            @Valid @RequestBody CommonUserRegisterDTO userDto, BindingResult bindingResult) {

        if (bindingResult.hasErrors()) {
            Map<String, String> errors = new HashMap<>();
            bindingResult.getFieldErrors().forEach(error -> errors.put(error.getField(), error.getDefaultMessage()));
            return ResponseEntity.badRequest().body(errors);
        }

        try {
            CommonUser createdUser = userService.registerCommonUser(userDto);
            return new ResponseEntity<>(createdUser, HttpStatus.CREATED);
        } catch (DuplicateResourceException e) {
            System.out.println("Erro ao tentar cadastrar usuário");
            System.out.println(e);
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (IllegalArgumentException e) {
            System.out.println("Erro ao tentar cadastrar usuário");
            System.out.println(e);
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            System.out.println("Erro ao tentar cadastrar usuário");
            System.out.println(e);
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/register/owner")
    public ResponseEntity<?> registerEventOwner(
            @Valid @RequestBody EventOwnerRegisterDTO userDto, BindingResult bindingResult) {

        if (bindingResult.hasErrors()) {
            Map<String, String> errors = new HashMap<>();
            bindingResult.getFieldErrors().forEach(error -> errors.put(error.getField(), error.getDefaultMessage()));
            return ResponseEntity.badRequest().body(errors);
        }

        try {
            EventOwnerUser createdOwnerUser = userService.registerEventOwnerUser(userDto);
            return new ResponseEntity<>(createdOwnerUser, HttpStatus.CREATED);
        } catch (DuplicateResourceException e) {
            System.out.println("Erro ao tentar cadastrar usuário");
            System.out.println(e);
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (IllegalArgumentException e) {
            System.out.println("Erro ao tentar cadastrar usuário");
            System.out.println(e);
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            System.out.println("Erro ao tentar cadastrar usuário");
            System.out.println(e);
            return ResponseEntity.badRequest().body(e.getMessage());
        }

    }

    @GetMapping("/{userId}")
    public ResponseEntity<?> getUserName(@PathVariable Long userId) {
        try {
            var user = userService.findById(userId);
            return ResponseEntity.ok().body(user);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e);
        }
    }
}
