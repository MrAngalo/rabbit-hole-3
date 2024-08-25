import { Component } from "@angular/core";
import { PopupMessagesService } from "../../services/popup-messages/popup-messages.service";
import { CommonModule } from "@angular/common";

@Component({
    selector: "app-popup-messages",
    standalone: true,
    imports: [CommonModule],
    templateUrl: "./popup-messages.component.html",
    styleUrl: "./popup-messages.component.scss"
})
export class PopupMessagesComponent {
    colorMap = {
        blue: "#56a9f2",
        green: "#0B950B",
        yellow: "#A27114",
        red: "#F54747"
    };

    constructor(public popup: PopupMessagesService) {}
}
