package br.recife.eventos.eventos_api.dto.user;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginResponseDTO {
    private String token;
    private String userType;
    private Long userId;
    private String userName;

    public LoginResponseDTO(String token, String userType, Long userId, String userName) {
        this.token = token;
        this.userType = userType;
        this.userId = userId;
        this.userName = userName;
    }
}
