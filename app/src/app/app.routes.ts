import { Routes } from "@angular/router";
import { LoginComponent } from "./pages/login/login.component";
import { HomeComponent } from "./pages/home/home.component";
import { TestTokenComponent } from "./pages/test-token/test-token.component";
import { authGuard, notAuthGuard } from "./userauth/auth.guard";

export const routes: Routes = [
    {
        path: "",
        component: HomeComponent
    },
    {
        path: "login",
        component: LoginComponent,
        canActivate: [notAuthGuard]
    },
    {
        path: "test_token",
        component: TestTokenComponent,
        canActivate: [authGuard]
    }
];
