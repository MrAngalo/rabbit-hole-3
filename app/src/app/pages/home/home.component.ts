import { Component } from "@angular/core";
import { RouterModule } from "@angular/router";
import { SceneService } from "../../services/scene/scene.service";

@Component({
    selector: "app-home",
    standalone: true,
    imports: [RouterModule],
    templateUrl: "./home.component.html",
    styleUrl: "./home.component.scss"
})
export class HomeComponent {
    constructor(private sceneService: SceneService) {}
}
