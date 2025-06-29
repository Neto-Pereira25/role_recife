package br.recife.eventos.eventos_api.dto.user;

import java.util.List;

import br.recife.eventos.eventos_api.validation.annotations.StrongPassword;
import br.recife.eventos.eventos_api.validation.annotations.ValidName;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CommonUserRegisterDTO {
    @NotBlank(message = "Nome é requerido")
    @ValidName
    private String name;

    @Email(message = "Formato inválido de email")
    @NotBlank(message = "Email é requerido")
    private String email;

    @NotBlank(message = "Senha é requerida")
    @StrongPassword
    private String password;

    @NotBlank(message = "Bairro é requerido.")
    private String neighborhood;

    @NotEmpty(message = "A lista de interesses deve ser apresentado pelo meno um interesse")
    private List<String> interests;
}
