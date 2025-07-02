import { Pipe, PipeTransform } from "@angular/core";
import { ValidationErrors } from "@angular/forms";

@Pipe({
    name: "formatError"
})
export class FormatErrorPipe implements PipeTransform {
    private static readonly errorMessages: Record<
        string,
        (error: any) => string
    > = {
        required: () => "This field is required.",
        email: () => "Invalid email address.",
        minlength: (error) => `Minimum length is ${error.requiredLength}.`,
        maxlength: (error) => `Maximum length is ${error.requiredLength}.`,
        pattern: () => "Invalid format."
    };

    transform(errors: ValidationErrors | null | undefined): string[] {
        if (!errors) return [];

        return Object.entries(errors).map(([errorKey, errorValue]) => {
            const messageFn = FormatErrorPipe.errorMessages[errorKey];
            return messageFn
                ? messageFn(errorValue)
                : `${errorKey}: ${JSON.stringify(errorValue)}`;
        });
    }
}
