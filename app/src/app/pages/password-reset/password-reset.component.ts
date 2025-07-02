import { Component } from "@angular/core";
import {
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators
} from "@angular/forms";
import { AuthService } from "../../services/auth/auth.service";
import { RouterModule } from "@angular/router";
import { PipeUtilsModule } from "../../utils/pipes/pipe-utils.module";

@Component({
    selector: "app-password-reset",
    imports: [ReactiveFormsModule, RouterModule, PipeUtilsModule],
    templateUrl: "./password-reset.component.html",
    styleUrl: "./password-reset.component.scss",
    standalone: true
})
export class PasswordResetComponent {
    formReset: FormGroup;
    formVerify: FormGroup;

    showErrorsReset = false;
    showErrorsVerify = false;

    constructor(private authService: AuthService) {
        this.formReset = new FormGroup({
            email: new FormControl("", [Validators.required, Validators.email])
        });

        this.formVerify = new FormGroup({
            password1: new FormControl("", [Validators.required]),
            password2: new FormControl("", [Validators.required]),
            token: new FormControl("", [Validators.required])
        });
    }

    passwordReset() {
        if (this.formReset.invalid) {
            this.formReset.markAsUntouched();
            this.showErrorsReset = true;
            return;
        }
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
            this.formReset.markAsUntouched();
            this.formVerify.markAsUntouched();
            this.showErrorsVerify = true;
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
