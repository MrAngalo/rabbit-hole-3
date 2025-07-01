import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { AuthService } from "../../services/auth/auth.service";

@Component({
    selector: "app-password-reset",
    standalone: true,
    imports: [FormsModule],
    templateUrl: "./password-reset.component.html",
    styleUrl: "./password-reset.component.scss"
})
export class PasswordResetComponent {
    email = "";
    password = "";

    constructor(private authService: AuthService) {}

    passwordReset() {
        this.authService.passwordReset(this.email).subscribe({
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
