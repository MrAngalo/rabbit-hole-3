import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { AuthService } from "../services/userauth/auth.service";

export const authGuard: CanActivateFn = (route, state) => {
    if (!inject(AuthService).isAuthenticated) {
        const url = route.pathFromRoot
            .map((v) => v.url.map((s) => s.toString()).join("/"))
            .join("/");
        inject(Router).navigate(["/login"], {
            queryParams: { ref: url }
        });
        return false;
    }
    return true;
};

export const notAuthGuard: CanActivateFn = (route, state) => {
    if (inject(AuthService).isAuthenticated) {
        inject(Router).navigate(["/"]);
        return false;
    }
    return true;
};
