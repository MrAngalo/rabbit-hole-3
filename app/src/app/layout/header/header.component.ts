import { Component } from "@angular/core";
import { AuthService } from "../../services/userauth/auth.service";
import { CommonModule } from "@angular/common";
import { ActivationEnd, Router, RouterModule } from "@angular/router";
import { User } from "../../services/userauth/userauth-types";
import { Observable, filter, map } from "rxjs";
import { SceneGlobalsResponse } from "../../services/scene/scene-types";
import { SceneService } from "../../services/scene/scene.service";
import { FormsModule } from "@angular/forms";

@Component({
    selector: "app-header",
    standalone: true,
    imports: [CommonModule, RouterModule, FormsModule],
    templateUrl: "./header.component.html",
    styleUrl: "./header.component.scss"
})
export class HeaderComponent {
    user$: Observable<User | null>;
    globals$: Observable<SceneGlobalsResponse>;
    sceneId!: number | null;

    constructor(
        private router: Router,
        private authService: AuthService,
        private sceneService: SceneService
    ) {
        this.user$ = this.authService.user$;
        this.globals$ = this.sceneService.globals$;
        this.router.events.subscribe((e) => {
            if (e instanceof ActivationEnd) {
                this.sceneId = e.snapshot.params["id"] || null;
            }
        });
    }
}
