import { Routes } from "@angular/router";
import { LoginComponent } from "./userauth/components/login/login.component";
import { HomeComponent } from "./home/home.component";
import { TestTokenComponent } from "./test-token/test-token.component";
import { authGuard, notAuthGuard } from "./userauth/guards/auth.guard";

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
