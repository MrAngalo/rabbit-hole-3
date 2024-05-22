import { Component } from "@angular/core";
import { SceneService } from "../../services/scene/scene.service";

@Component({
    selector: "app-scene-info",
    standalone: true,
    imports: [],
    templateUrl: "./scene-info.component.html",
    styleUrl: "./scene-info.component.scss"
})
export class SceneInfoComponent {
    constructor(scene: SceneService) {
        scene.fetchScene(0).subscribe({
            next: (data) => {
                console.log(data);
            },
            error: (data) => {
                console.log(data.error);
            }
        });
    }
}
