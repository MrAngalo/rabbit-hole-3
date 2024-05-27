import { Component } from "@angular/core";
import { SceneService } from "../../services/scene/scene.service";
import { Scene, SceneStatus } from "../../types/models/scene";
import { Observable } from "rxjs";
import { CommonModule } from "@angular/common";
import { ActivatedRoute, RouterModule } from "@angular/router";
import { PipeUtilsModule } from "../../utils/pipes/pipe-utils.module";
import { TenorPipesModule } from "../../pipes/tenor/tenor-pipes.module";

@Component({
    selector: "app-scene-info",
    standalone: true,
    imports: [CommonModule, RouterModule, TenorPipesModule, PipeUtilsModule],
    templateUrl: "./scene-info.component.html",
    styleUrl: "./scene-info.component.scss"
})
export class SceneInfoComponent {
    SceneStatus = SceneStatus;

    scene$!: Observable<Scene>;
    options = 3;

    constructor(
        private route: ActivatedRoute,
        private sceneService: SceneService
    ) {
        this.route.params.subscribe((params) => {
            const id = params["id"];
            this.scene$ = this.sceneService.fetchScene(id);
        });
    }

    rateClick(rating: "positive" | "negative") {
        console.log(rating);
    }

    reportClick() {
        console.log("report");
    }
}
