import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { AuthenticationService } from "../authentication.service";
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
        private auth: AuthenticationService,
        private router: Router
    ) {}

    async login() {
        this.auth.login(this.email, this.password).subscribe({
            next: (data) => {
                console.log(data);
            },
            error: (error) => {
                console.log(error);
            }
        });
    }
}
