import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export const strongPasswordValidator: ValidatorFn = (
    control: AbstractControl
): ValidationErrors | null => {
    const password1 = control.get("password1")?.value;

    const passwordFewCharacters = password1.length < 8;
    const passwordNoNumbers = !/\d/.test(password1);
    const passwordNoLetter = !/[a-zA-Z]/.test(password1);

    const errors: any = {};
    if (passwordFewCharacters) {
        errors["passwordFewCharacters"] = { requiredLength: 8 };
    }
    if (passwordNoNumbers) {
        errors["passwordNoNumbers"] = { requiredNumbers: 1 };
    }
    if (passwordNoLetter) {
        errors["passwordNoLetter"] = { requiredLetters: 1 };
    }

    return Object.keys(errors).length > 0 ? errors : null;
};
