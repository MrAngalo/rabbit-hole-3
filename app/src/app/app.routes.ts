import { Routes } from "@angular/router";
import { LoginComponent } from "./pages/login/login.component";
import { HomeComponent } from "./pages/home/home.component";
import { authGuard, notAuthGuard } from "./guards/auth.guard";
import { SceneInfoComponent } from "./pages/scene-info/scene-info.component";
import { SceneCreateComponent } from "./pages/scene-create/scene-create.component";
import { AccountComponent } from "./pages/account/account.component";
import { UserPageComponent } from "./pages/user-page/user-page.component";
import { LogoutComponent } from "./pages/logout/logout.component";
import { PasswordResetComponent } from "./pages/password-reset/password-reset.component";

export const routes: Routes = [
    {
        path: "",
        component: HomeComponent
    },
    {
        path: "scene",
        redirectTo: "scene/0",
        pathMatch: "full"
    },
    {
        path: "scene/:id",
        component: SceneInfoComponent
    },
    {
        path: "create",
        redirectTo: "create/0",
        pathMatch: "full"
    },
    {
        path: "create/:id",
        component: SceneCreateComponent,
        canActivate: [authGuard]
    },
    {
        path: "login",
        component: LoginComponent,
        canActivate: [notAuthGuard]
    },
    {
        path: "logout",
        component: LogoutComponent,
        canActivate: [authGuard]
    },
    {
        path: "pwreset",
        component: PasswordResetComponent,
        canActivate: [notAuthGuard]
    },
    {
        path: "account",
        component: AccountComponent,
        canActivate: [authGuard]
    },
    {
        path: "user/:username",
        component: UserPageComponent
    },
    {
        path: "**",
        redirectTo: "/"
    }
];
