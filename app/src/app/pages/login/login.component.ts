import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { AuthService } from "../../services/userauth/auth.service";
import { ActivatedRoute, Router } from "@angular/router";

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
        private route: ActivatedRoute
    ) {}

    login() {
        this.authService.login(this.email, this.password).subscribe({
            next: (data) => {
                const ref = this.route.snapshot.queryParams["ref"];
                this.router.navigate([ref || "/"]);
            },
            error: (data) => {
                console.log(data.error);
            }
        });
    }
}
