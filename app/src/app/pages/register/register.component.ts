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
    selector: "app-register",
    imports: [ReactiveFormsModule, RouterModule, PipeUtilsModule],
    templateUrl: "./register.component.html",
    styleUrl: "./register.component.scss",
    standalone: true
})
export class RegisterComponent implements OnDestroy {
    form: FormGroup;

    showErrors = false;

    readonly cooldownCookie = "register_next";
    cooldownTimer: CooldownTimer;

    constructor(
        private authService: AuthService,
        private cookie: CookieService,
        private route: ActivatedRoute,
        private router: Router,
        private popupService: PopupMessagesService
    ) {
        const email = this.route.snapshot.queryParamMap.get("email") ?? "";

        this.form = new FormGroup(
            {
                email: new FormControl(email, [
                    Validators.required,
                    Validators.email
                ]),
                username: new FormControl("", [Validators.required]),
                password1: new FormControl("", [Validators.required]),
                password2: new FormControl("", [Validators.required])
            },
            { validators: [passwordMatchValidator, strongPasswordValidator] }
        );

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

    register() {
        if (this.form.invalid) {
            this.form.markAsUntouched();
            this.showErrors = true;
            return;
        }

        const { email, username, password1, password2 } = this.form.value;
        this.authService
            .register(email, username, password1, password2)
            .subscribe({
                next: (res) => {
                    this.router.navigate(["/rgverify"], {
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
                            this.form.setErrors(objs as ValidationErrors);
                        } else {
                            this.form
                                .get(field)
                                ?.setErrors(objs as ValidationErrors);
                        }
                    });
                    this.showErrors = true;
                }
            });
    }
}
