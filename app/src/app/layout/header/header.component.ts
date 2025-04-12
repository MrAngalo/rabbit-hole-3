import { Component, Inject } from "@angular/core";
import { AuthService } from "../../services/userauth/auth.service";
import { CommonModule } from "@angular/common";
import { ActivationEnd, Router, RouterModule } from "@angular/router";
import { User } from "../../services/userauth/userauth-types";
import { Observable, filter, map } from "rxjs";
import { SceneGlobalsResponse } from "../../services/scene/scene-types";
import { SceneService } from "../../services/scene/scene.service";
import { FormsModule } from "@angular/forms";
import { DeclaredData } from "../../app.config";

@Component({
    selector: "app-header",
    standalone: true,
    imports: [CommonModule, RouterModule, FormsModule],
    templateUrl: "./header.component.html",
    styleUrl: "./header.component.scss"
})
export class HeaderComponent {
    user$: Observable<User | null>;
    sceneId!: number | null;

    constructor(
        @Inject("DATA") public data: DeclaredData,
        private router: Router,
        private authService: AuthService
    ) {
        this.user$ = this.authService.user$;
        this.router.events.subscribe((e) => {
            if (e instanceof ActivationEnd) {
                this.sceneId = e.snapshot.params["id"] || null;
            }
        });
    }
}
