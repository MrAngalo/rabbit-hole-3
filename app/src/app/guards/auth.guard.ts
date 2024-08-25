import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { AuthService } from "../services/userauth/auth.service";
import { PopupMessagesService } from "../services/popup-messages/popup-messages.service";

export const authGuard: CanActivateFn = (route, state) => {
    if (!inject(AuthService).isAuthenticated) {
        const url = route.pathFromRoot
            .map((v) => v.url.map((s) => s.toString()).join("/"))
            .join("/");
        inject(Router).navigate(["/login"], {
            queryParams: { ref: url }
        });
        inject(PopupMessagesService).display({
            message: "You must be logged in to access this.",
            color: "yellow"
        });
        return false;
    }
    return true;
};

export const notAuthGuard: CanActivateFn = (route, state) => {
    if (inject(AuthService).isAuthenticated) {
        inject(Router).navigate(["/"]);
        inject(PopupMessagesService).display({
            message: "You are already logged in.",
            color: "yellow"
        });
        return false;
    }
    return true;
};
