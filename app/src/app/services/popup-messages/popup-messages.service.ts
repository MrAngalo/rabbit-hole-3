import { Injectable } from "@angular/core";
import { NavigationStart, Router } from "@angular/router";
import { BehaviorSubject, Subject } from "rxjs";

export type PopupInfo = {
    message: string;
    color: "green" | "red" | "yellow" | "blue";
};

@Injectable({
    providedIn: "root"
})
export class PopupMessagesService {
    private popups: Set<PopupInfo> = new Set();
    private popupSubject = new BehaviorSubject(this.popups);
    popups$ = this.popupSubject.asObservable();

    constructor(router: Router) {
        router.events.subscribe((event) => {
            if (event instanceof NavigationStart) {
                this.clear();
            }
        });
    }

    display(popup: PopupInfo) {
        this.popups.add(popup);
    }

    clear() {
        this.popups.clear();
    }
}
