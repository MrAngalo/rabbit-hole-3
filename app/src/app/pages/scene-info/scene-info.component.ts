import { Component } from "@angular/core";
import { SceneService } from "../../services/scene/scene.service";
import {
    ErrorResponse,
    SceneResponse,
    SceneStatus
} from "../../services/scene/scene-types";
import { Observable } from "rxjs";
import { CommonModule } from "@angular/common";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { PipeUtilsModule } from "../../utils/pipes/pipe-utils.module";
import { TenorPipesModule } from "../../pipes/tenor/tenor-pipes.module";
import { PopupMessagesService } from "../../services/popup-messages/popup-messages.service";

@Component({
    selector: "app-scene-info",
    standalone: true,
    imports: [CommonModule, RouterModule, TenorPipesModule, PipeUtilsModule],
    templateUrl: "./scene-info.component.html",
    styleUrl: "./scene-info.component.scss"
})
export class SceneInfoComponent {
    SceneStatus = SceneStatus;
    scene: SceneResponse | null = null;
    options = 3;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private sceneService: SceneService,
        private popupService: PopupMessagesService
    ) {
        this.route.params.subscribe((params) => {
            const id = params["id"];
            this.sceneService.fetchScene(id).subscribe({
                next: (scene) => (this.scene = scene),
                error: (res: ErrorResponse) => {
                    this.router.navigate(["/"]);
                    this.popupService.clear();
                    this.popupService.display({
                        message: `Cannot load scene. ${res.error.error}`,
                        color: "red"
                    });
                }
            });
        });
    }

    rateClick(rating: "positive" | "negative") {
        console.log(rating);
    }

    reportClick() {
        console.log("report");
    }
}
