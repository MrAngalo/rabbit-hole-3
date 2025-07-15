import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export const passwordMatchValidator: ValidatorFn = (
    control: AbstractControl
): ValidationErrors | null => {
    const password1 = control.get("password1")?.value;
    const password2 = control.get("password2")?.value;

    if (password1 !== password2) {
        return { passwordsMismatch: true };
    }
    return null;
};
