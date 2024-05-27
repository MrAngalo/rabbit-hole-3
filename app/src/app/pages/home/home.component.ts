import { Component } from "@angular/core";
import { RouterModule } from "@angular/router";
import { SceneService } from "../../services/scene/scene.service";
import { Observable } from "rxjs";
import { SceneGlobalsResponse } from "../../services/scene/scene-types";
import { CommonModule } from "@angular/common";

@Component({
    selector: "app-home",
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: "./home.component.html",
    styleUrl: "./home.component.scss"
})
export class HomeComponent {
    globals$: Observable<SceneGlobalsResponse>;

    constructor(private sceneService: SceneService) {
        this.globals$ = this.sceneService.globals$;
    }
}
