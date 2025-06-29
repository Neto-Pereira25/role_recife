package br.recife.eventos.eventos_api.validation.validators;

import br.recife.eventos.eventos_api.validation.annotations.ValidName;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class NameValidator implements ConstraintValidator<ValidName, String> {

    private static final String NAME_PATTERN = "^[A-Za-zÀ-ú]+(?: [A-Za-zÀ-ú]+)*$";

    @Override
    public boolean isValid(String name, ConstraintValidatorContext context) {
        if (name == null)
            return false;
        return name.matches(NAME_PATTERN);
    }
}
