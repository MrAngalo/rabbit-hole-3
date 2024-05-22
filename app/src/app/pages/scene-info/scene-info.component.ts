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
    constructor(private scene: SceneService) {
        scene
            .fetchScene(0)
            .then((data) => {
                console.log(data);
            })
            .catch((err) => {
                console.log(err);
            });
    }
}
