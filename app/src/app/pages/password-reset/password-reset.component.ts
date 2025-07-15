import { Component, OnDestroy } from "@angular/core";
import {
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators
} from "@angular/forms";
import { AuthService } from "../../services/auth/auth.service";
import { RouterModule } from "@angular/router";
import { PipeUtilsModule } from "../../utils/pipes/pipe-utils.module";
import { CookieService } from "ngx-cookie-service";

@Component({
    selector: "app-password-reset",
    imports: [ReactiveFormsModule, RouterModule, PipeUtilsModule],
    templateUrl: "./password-reset.component.html",
    styleUrl: "./password-reset.component.scss",
    standalone: true
})
export class PasswordResetComponent implements OnDestroy {
    formReset: FormGroup;
    formVerify: FormGroup;

    showErrorsReset = false;
    showErrorsVerify = false;

    readonly codeCooldownCookie = "pwreset_next";
    codeCooldownInterval: any | null = null;
    codeCooldown = 0;

    constructor(
        private authService: AuthService,
        private cookie: CookieService
    ) {
        this.formReset = new FormGroup({
            email: new FormControl("", [Validators.required, Validators.email])
        });

        this.formVerify = new FormGroup({
            password1: new FormControl("", [Validators.required]),
            password2: new FormControl("", [Validators.required]),
            token: new FormControl("", [Validators.required])
        });

        const next = parseInt(this.cookie.get(this.codeCooldownCookie)) ?? 0;
        const cooldown = Math.round((next - Date.now()) / 1000);
        if (cooldown > 0) {
            this.tickCooldown(cooldown);
        } else {
            this.cookie.delete(this.codeCooldownCookie);
        }
    }

    ngOnDestroy(): void {
        if (this.codeCooldownInterval !== null) {
            clearInterval(this.codeCooldownInterval);
            this.codeCooldownInterval = null;
        }
    }

    passwordCode() {
        if (this.formReset.invalid) {
            this.formReset.markAsUntouched();
            this.showErrorsReset = true;
            return;
        }
        const { email } = this.formReset.value;
        this.authService.passwordCode(email).subscribe({
            next: () => this.tickCooldown(60),
            error: () => this.tickCooldown(60)
        });
    }

    passwordNew() {
        if (this.formReset.invalid || this.formVerify.invalid) {
            this.formReset.markAsUntouched();
            this.formVerify.markAsUntouched();
            this.showErrorsVerify = true;
            return;
        }

        const { email } = this.formReset.value;
        const { password1, password2, token } = this.formVerify.value;
        this.authService
            .passwordNew(email, password1, password2, token)
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

    private tickCooldown(seconds: number) {
        this.codeCooldown = seconds;
        const next = Date.now() + seconds * 1000;
        this.cookie.set(this.codeCooldownCookie, next + "");
        if (this.codeCooldownInterval !== null) {
            return;
        }
        this.codeCooldownInterval = setInterval(() => {
            if (this.codeCooldown > 0) {
                this.codeCooldown -= 1;
                this.cookie.set(this.codeCooldownCookie, next + "");
            } else if (this.codeCooldownInterval !== null) {
                clearInterval(this.codeCooldownInterval);
                this.codeCooldownInterval = null;
                this.cookie.delete(this.codeCooldownCookie);
            }
        }, 1000);
    }
}
