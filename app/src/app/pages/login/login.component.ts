import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { AuthService } from "../../services/userauth/auth.service";
import { Router } from "@angular/router";

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
        private router: Router
    ) {}

    login() {
        this.authService.login(this.email, this.password).subscribe({
            next: (data) => {
                this.router.navigate(["/test_token"]);
            },
            error: (data) => {
                console.log(data.error);
            }
        });
    }
}
