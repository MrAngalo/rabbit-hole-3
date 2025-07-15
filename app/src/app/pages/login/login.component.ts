import { Component } from "@angular/core";
import {
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators
} from "@angular/forms";
import { AuthService } from "../../services/auth/auth.service";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { ErrorResponse } from "../../services/scene/scene-types";
import { PopupMessagesService } from "../../services/popup-messages/popup-messages.service";
import { PipeUtilsModule } from "../../utils/pipes/pipe-utils.module";

@Component({
    selector: "app-login",
    imports: [ReactiveFormsModule, RouterModule, PipeUtilsModule],
    templateUrl: "./login.component.html",
    styleUrl: "./login.component.scss",
    standalone: true
})
export class LoginComponent {
    form: FormGroup;
    showErrors = false;

    constructor(
        private authService: AuthService,
        private router: Router,
        private route: ActivatedRoute,
        private popupService: PopupMessagesService
    ) {
        this.form = new FormGroup({
            email: new FormControl("", [Validators.required, Validators.email]),
            password: new FormControl("", [Validators.required])
        });

        if (this.route.snapshot.queryParamMap.has("email")) {
            this.form.setValue({
                email: this.route.snapshot.queryParamMap.get("email"),
                password: ""
            });
        }
    }

    login() {
        if (this.form.invalid) {
            this.form.markAsUntouched();
            this.showErrors = true;
            return;
        }
        const { email, password } = this.form.value;
        this.authService.login(email, password).subscribe({
            next: (data) => {
                const ref = this.route.snapshot.queryParams["ref"];
                this.router.navigate([ref || "/"]);
            },
            error: (res: ErrorResponse) => {
                this.popupService.clear();
                this.popupService.display({
                    message: res.error.error,
                    color: "red"
                });
            }
        });
    }
}
