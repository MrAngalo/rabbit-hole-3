import { Component } from "@angular/core";
import { AuthService, User } from "../../userauth/auth.service";
import { CommonModule } from "@angular/common";

@Component({
    selector: "app-header",
    standalone: true,
    imports: [CommonModule],
    templateUrl: "./header.component.html",
    styleUrl: "./header.component.scss"
})
export class HeaderComponent {
    user: Readonly<User | null>;

    constructor(auth: AuthService) {
        this.user = auth.user;
    }
}
