package br.recife.eventos.eventos_api.dto.user;

import br.recife.eventos.eventos_api.models.entities.User.UserProfile;
import br.recife.eventos.eventos_api.validation.annotations.StrongPassword;
import br.recife.eventos.eventos_api.validation.annotations.ValidCpfCnpj;
import br.recife.eventos.eventos_api.validation.annotations.ValidName;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class EventOwnerRegisterDTO {
    @NotBlank(message = "Nome é requerido.")
    @ValidName
    private String name;

    @Email(message = "Formato de email inválido.")
    @NotBlank(message = "Email é requerido.")
    private String email;

    @NotBlank(message = "Senha é requerida.")
    @StrongPassword
    private String password;

    @NotBlank(message = "CPF or CNPJ é requerido.")
    @ValidCpfCnpj
    private String cpfCnpj;

    @NotNull(message = "O perfil do usuário é requerido. (PUBLIC_USER ou PRIVATE_USER)")
    private UserProfile userProfile;
}
