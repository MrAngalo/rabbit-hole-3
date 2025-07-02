import { Component } from "@angular/core";
import {
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators
} from "@angular/forms";
import { AuthService } from "../../services/auth/auth.service";
import { RouterModule } from "@angular/router";

@Component({
    selector: "app-password-reset",
    standalone: true,
    imports: [ReactiveFormsModule, RouterModule],
    templateUrl: "./password-reset.component.html",
    styleUrl: "./password-reset.component.scss"
})
export class PasswordResetComponent {
    formReset: FormGroup;
    formVerify: FormGroup;

    constructor(private authService: AuthService) {
        this.formReset = new FormGroup({
            email: new FormControl("", [Validators.required])
        });

        this.formVerify = new FormGroup({
            password1: new FormControl("", [Validators.required]),
            password2: new FormControl("", [Validators.required]),
            token: new FormControl("", [Validators.required])
        });
    }

    passwordReset() {
        const { email } = this.formReset.value;
        this.authService.passwordReset(email).subscribe({
            next: () => {
                // const ref = this.route.snapshot.queryParams["ref"];
                // this.router.navigate([ref || "/"]);
            },
            error: () => {
                // this.popupService.clear();
                // this.popupService.display({
                //     message: res.error.error,
                //     color: "red"
                // });
            }
        });
    }

    passwordVerify() {
        if (this.formReset.invalid || this.formVerify.invalid) {
            this.formReset.markAsTouched();
            this.formVerify.markAsTouched();
            return;
        }

        const { email } = this.formReset.value;
        const { password1, password2, token } = this.formVerify.value;
        this.authService
            .passwordVerify(email, password1, password2, token)
            .subscribe({
                next: () => {
                    // const ref = this.route.snapshot.queryParams["ref"];
                    // this.router.navigate([ref || "/"]);
                },
                error: () => {
                    // this.popupService.clear();
                    // this.popupService.display({
                    //     message: res.error.error,
                    //     color: "red"
                    // });
                }
            });
    }
}
