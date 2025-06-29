package br.recife.eventos.eventos_api.validation.annotations;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

import br.recife.eventos.eventos_api.validation.validators.PasswordValidator;
import jakarta.validation.Constraint;
import jakarta.validation.Payload;

@Documented
@Constraint(validatedBy = PasswordValidator.class)
@Target({ ElementType.FIELD })
@Retention(RetentionPolicy.RUNTIME)
public @interface StrongPassword {
    String message() default "Senha inválida. Deve conter entre 8 e 30 caracteres, uma letra maiúscula, uma minúscula, um número e um caractere especial.";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
