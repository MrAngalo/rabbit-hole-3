import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { AuthService } from "../../userauth/auth.service";
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
        private auth: AuthService,
        private router: Router
    ) {}

    async login() {
        this.auth
            .login(this.email, this.password)
            .then(() => {
                this.router.navigate(["/test_token"]);
            })
            .catch((error) => {
                console.log(error);
            });
    }
}
