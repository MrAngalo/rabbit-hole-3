import { Routes } from "@angular/router";
import { LoginComponent } from "./pages/login/login.component";
import { HomeComponent } from "./pages/home/home.component";
import { TestTokenComponent } from "./pages/test-token/test-token.component";
import { authGuard, notAuthGuard } from "./guards/auth.guard";
import { SceneInfoComponent } from "./pages/scene-info/scene-info.component";
import { SceneCreateComponent } from "./pages/scene-create/scene-create.component";

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
        path: "test_token",
        component: TestTokenComponent,
        canActivate: [authGuard]
    },
    {
        path: "**",
        redirectTo: "/"
    }
];
