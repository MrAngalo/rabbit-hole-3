import { Component } from "@angular/core";
import { SceneService } from "../../services/scene/scene.service";
import { Scene, SceneStatus } from "../../types/models/scene";
import { Observable } from "rxjs";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { PipeUtilsModule } from "../../utils/pipe-utils/pipe-utils.module";

@Component({
    selector: "app-scene-info",
    standalone: true,
    imports: [CommonModule, RouterModule, PipeUtilsModule],
    templateUrl: "./scene-info.component.html",
    styleUrl: "./scene-info.component.scss"
})
export class SceneInfoComponent {
    scene$: Observable<Scene>;
    SceneStatus = SceneStatus;
    options = 3;

    constructor(sceneService: SceneService) {
        this.scene$ = sceneService.fetchScene(0);
    }
}
