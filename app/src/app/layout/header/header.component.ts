import { Component } from "@angular/core";
import { AuthService, User } from "../../services/userauth/auth.service";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";

@Component({
    selector: "app-header",
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: "./header.component.html",
    styleUrl: "./header.component.scss"
})
export class HeaderComponent {
    user: Readonly<User | null>;

    constructor(auth: AuthService) {
        this.user = auth.user;
    }
}
