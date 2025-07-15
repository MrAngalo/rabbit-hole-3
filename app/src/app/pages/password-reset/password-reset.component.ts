import { Component, OnDestroy } from "@angular/core";
import {
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    ValidationErrors,
    Validators
} from "@angular/forms";
import { AuthService } from "../../services/auth/auth.service";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { PipeUtilsModule } from "../../utils/pipes/pipe-utils.module";
import { CookieService } from "ngx-cookie-service";
import { CooldownTimer } from "../../utils/cooldown";
import { strongPasswordValidator } from "../../utils/validators/strong-password-validator";
import { passwordMatchValidator } from "../../utils/validators/password-match-validator";
import { PopupMessagesService } from "../../services/popup-messages/popup-messages.service";

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

    readonly cooldownCookie = "pwreset_next";
    cooldownTimer: CooldownTimer;

    constructor(
        private authService: AuthService,
        private cookie: CookieService,
        private route: ActivatedRoute,
        private router: Router,
        private popupService: PopupMessagesService
    ) {
        this.formReset = new FormGroup({
            email: new FormControl("", [Validators.required, Validators.email])
        });

        this.formVerify = new FormGroup(
            {
                password1: new FormControl("", [Validators.required]),
                password2: new FormControl("", [Validators.required]),
                token: new FormControl("", [Validators.required])
            },
            { validators: [passwordMatchValidator, strongPasswordValidator] }
        );

        if (this.route.snapshot.queryParamMap.has("email")) {
            this.formReset.setValue({
                email: this.route.snapshot.queryParamMap.get("email")
            });
        }

        if (this.route.snapshot.queryParamMap.has("token")) {
            this.formVerify.setValue({
                password1: "",
                password2: "",
                token: this.route.snapshot.queryParamMap.get("token")
            });
        }

        this.cooldownTimer = new CooldownTimer();
        this.cooldownTimer.onTick = (seconds) => {
            if (this.cookie.get(this.cooldownCookie) === "") {
                const next = Date.now() + seconds * 1000;
                this.cookie.set(this.cooldownCookie, next + "");
            }
        };
        this.cooldownTimer.onFinish = () => {
            this.cookie.delete(this.cooldownCookie);
        };

        if (this.cookie.get(this.cooldownCookie) !== "") {
            const next = parseInt(this.cookie.get(this.cooldownCookie));
            const cooldown = Math.round((next - Date.now()) / 1000);
            if (cooldown > 0) {
                this.cooldownTimer.start(cooldown);
            } else {
                this.cookie.delete(this.cooldownCookie);
            }
        }
    }

    ngOnDestroy(): void {
        this.cooldownTimer.stop();
    }

    passwordCode() {
        if (this.formReset.invalid) {
            this.formReset.markAsUntouched();
            this.showErrorsReset = true;
            return;
        }
        this.cooldownTimer.start(60);
        const { email } = this.formReset.value;
        this.authService.passwordCode(email).subscribe({
            next: () => {},
            error: () => {}
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
                next: (res) => {
                    this.router.navigate(["/login"], {
                        queryParams: { email: email }
                    });
                    this.popupService.clear();
                    this.popupService.display({
                        message: res.status,
                        color: "green"
                    });
                },
                error: (res) => {
                    const validators = res.error.validators;
                    Object.entries(validators).forEach(([field, objs]) => {
                        if (field === "") {
                            this.formVerify.setErrors(objs as ValidationErrors);
                        } else {
                            this.formVerify
                                .get(field)
                                ?.setErrors(objs as ValidationErrors);
                        }
                    });
                    this.showErrorsVerify = true;
                }
            });
    }
}
