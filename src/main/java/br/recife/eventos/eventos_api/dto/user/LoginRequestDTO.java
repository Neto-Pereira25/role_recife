package br.recife.eventos.eventos_api.dto.user;

import br.recife.eventos.eventos_api.validation.annotations.StrongPassword;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class LoginRequestDTO {

    @Email(message = "Email inválido")
    @NotBlank(message = "Email é requerido")
    private String email;

    @NotBlank(message = "Senha é requerida")
    @StrongPassword
    private String password;
}
