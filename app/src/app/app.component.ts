import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { HeaderComponent } from "./layout/header/header.component";
import { FooterComponent } from "./layout/footer/footer.component";
import { PopupMessagesComponent } from "./layout/popup-messages/popup-messages.component";

@Component({
    selector: "app-root",
    standalone: true,
    imports: [
        RouterOutlet,
        HeaderComponent,
        FooterComponent,
        PopupMessagesComponent
    ],
    templateUrl: "./app.component.html",
    styleUrl: "./app.component.scss"
})
export class AppComponent {
    title = "app";

    constructor() {}

    ngOnInit(): void {}
}
