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
import { PopupMessagesService } from "../../services/popup-messages/popup-messages.service";

@Component({
    selector: "app-register-verify",
    imports: [ReactiveFormsModule, RouterModule, PipeUtilsModule],
    templateUrl: "./register-verify.component.html",
    styleUrl: "./register-verify.component.scss",
    standalone: true
})
export class RegisterVerifyComponent implements OnDestroy {
    form: FormGroup;
    showErrorsEmail = false;
    showErrorsToken = false;

    readonly cooldownCookie = "rgverify_next";
    cooldownTimer: CooldownTimer;

    constructor(
        private authService: AuthService,
        private cookie: CookieService,
        private route: ActivatedRoute,
        private router: Router,
        private popupService: PopupMessagesService
    ) {
        const email = this.route.snapshot.queryParamMap.get("email") ?? "";
        const token = this.route.snapshot.queryParamMap.get("token") ?? "";

        this.form = new FormGroup({
            email: new FormControl(email, [
                Validators.required,
                Validators.email
            ]),
            token: new FormControl(token, [Validators.required])
        });

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

    registerCode() {
        if (this.form.get("email")!.invalid) {
            this.form.markAsUntouched();
            this.showErrorsEmail = true;
            return;
        }
        this.cooldownTimer.start(60);
        const { email } = this.form.value;
        this.authService.registerCode(email).subscribe({
            next: () => {},
            error: () => {}
        });
    }

    registerVerify() {
        if (this.form.invalid) {
            this.form.markAsUntouched();
            this.showErrorsEmail = true;
            this.showErrorsToken = true;
            return;
        }

        const { email, token } = this.form.value;
        this.authService.registerVerify(email, token).subscribe({
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
                        this.form.setErrors(objs as ValidationErrors);
                    } else {
                        this.form
                            .get(field)
                            ?.setErrors(objs as ValidationErrors);
                    }
                });
                this.showErrorsEmail = true;
                this.showErrorsToken = true;
            }
        });
    }
}
