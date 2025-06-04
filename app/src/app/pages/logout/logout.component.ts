import { Component } from "@angular/core";
import { AuthService } from "../../services/auth/auth.service";
import { Router } from "@angular/router";
import { PopupMessagesService } from "../../services/popup-messages/popup-messages.service";

@Component({
    selector: "app-logout",
    standalone: true,
    imports: [],
    templateUrl: "./logout.component.html",
    styleUrl: "./logout.component.scss"
})
export class LogoutComponent {
    constructor(
        authService: AuthService,
        router: Router,
        messageService: PopupMessagesService
    ) {
        authService.logout().subscribe(() => {
            router.navigate(["/"]);
            messageService.display({
                message: "You have successfully logged off.",
                color: "green"
            });
        });
    }
}
