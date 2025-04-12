import { Component, Inject } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { DeclaredData } from "../../app.config";

@Component({
    selector: "app-home",
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: "./home.component.html",
    styleUrl: "./home.component.scss"
})
export class HomeComponent {
    constructor(@Inject("DATA") public data: DeclaredData) {}
}
