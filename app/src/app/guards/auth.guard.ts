import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { AuthService } from "../services/userauth/auth.service";
import { PopupMessagesService } from "../services/popup-messages/popup-messages.service";
import { firstValueFrom } from "rxjs";

export const authGuard: CanActivateFn = async (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);
    const messageService = inject(PopupMessagesService);

    const user = await firstValueFrom(authService.user$);
    if (user === null) {
        const url = route.pathFromRoot
            .map((v) => v.url.map((s) => s.toString()).join("/"))
            .join("/");
        if (url.startsWith("/logout")) {
            router.navigate(["/"]);
            messageService.display({
                message: "You are already logged out",
                color: "yellow"
            });
            return false;
        } else {
            router.navigate(["/login"], {
                queryParams: { ref: url }
            });
            messageService.display({
                message: "You must be logged in to access this.",
                color: "yellow"
            });
            return false;
        }
    }
    return true;
};

export const notAuthGuard: CanActivateFn = async (route, state) => {
    const authService = inject(AuthService);
    const router = inject(Router);
    const messageService = inject(PopupMessagesService);

    const user = await firstValueFrom(authService.user$);
    if (user !== null) {
        router.navigate(["/"]);
        messageService.display({
            message: "You are already logged in.",
            color: "yellow"
        });
        return false;
    }
    return true;
};
