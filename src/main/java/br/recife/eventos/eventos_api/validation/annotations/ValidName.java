package br.recife.eventos.eventos_api.validation.annotations;

import java.lang.annotation.Documented;
import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

import br.recife.eventos.eventos_api.validation.validators.NameValidator;
import jakarta.validation.Constraint;
import jakarta.validation.Payload;

@Documented
@Constraint(validatedBy = NameValidator.class)
@Target({ ElementType.FIELD })
@Retention(RetentionPolicy.RUNTIME)
public @interface ValidName {
    String message() default "Nome inválido. Não pode conter números, caracteres especiais ou múltiplos espaços";

    Class<?>[] groups() default {};

    Class<? extends Payload>[] payload() default {};
}
