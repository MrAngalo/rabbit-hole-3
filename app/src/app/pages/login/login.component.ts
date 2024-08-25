import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { AuthService } from "../../services/userauth/auth.service";
import { ActivatedRoute, Router } from "@angular/router";
import { ErrorResponse } from "../../services/scene/scene-types";
import { PopupMessagesService } from "../../services/popup-messages/popup-messages.service";

@Component({
    selector: "app-login",
    standalone: true,
    imports: [FormsModule],
    templateUrl: "./login.component.html",
    styleUrl: "./login.component.scss"
})
export class LoginComponent {
    email = "";
    password = "";

    constructor(
        private authService: AuthService,
        private router: Router,
        private route: ActivatedRoute,
        private popupService: PopupMessagesService
    ) {}

    login() {
        this.authService.login(this.email, this.password).subscribe({
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
