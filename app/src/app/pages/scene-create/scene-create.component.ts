import { Component } from "@angular/core";
import {
    ErrorResponse,
    SceneResponse,
    SceneStatus
} from "../../services/scene/scene-types";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { Observable } from "rxjs";
import { SceneService } from "../../services/scene/scene.service";
import { CommonModule } from "@angular/common";
import { AuthService } from "../../services/auth/auth.service";
import { User } from "../../services/auth/auth-types";
import { TenorPipesModule } from "../../pipes/tenor/tenor-pipes.module";
import { PipeUtilsModule } from "../../utils/pipes/pipe-utils.module";
import { FormsModule } from "@angular/forms";
import { FetchPostPipe } from "../../pipes/tenor/fetch-post/fetch-post.pipe";
import { TenorService } from "../../services/tenor/tenor.service";
import { TenorResponseObject } from "../../services/tenor/tenor-types";
import { PopupMessagesService } from "../../services/popup-messages/popup-messages.service";

@Component({
    selector: "app-scene-create",
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        PipeUtilsModule,
        TenorPipesModule,
        FormsModule
    ],
    templateUrl: "./scene-create.component.html",
    styleUrl: "./scene-create.component.scss"
})
export class SceneCreateComponent {
    user$: Observable<User>;
    SceneStatus = SceneStatus;

    parentId!: number;
    parent: SceneResponse | null = null;
    options = 3;

    newTitle: string = "";
    newDesc: string = "";
    newGifId: string = "";

    tenorResults: TenorResponseObject[] = [];

    previewGifUrl = this.tenorService.defaultUrl;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private authService: AuthService,
        private sceneService: SceneService,
        private tenorService: TenorService,
        private popupService: PopupMessagesService
    ) {
        this.user$ = this.authService.user$ as Observable<User>;
        this.route.params.subscribe((params) => {
            this.parentId = params["id"];
            this.sceneService.fetchScene(this.parentId).subscribe({
                next: (parent) => (this.parent = parent),
                error: (res: ErrorResponse) => {
                    this.router.navigate(["/"]);
                    this.popupService.clear();
                    this.popupService.display({
                        message: `Cannot load parent scene. ${res.error.error}`,
                        color: "red"
                    });
                }
            });
        });
    }

    async updateGifSearch(event: Event) {
        const target = event.target as HTMLInputElement;

        // Trim all spaces of input field
        target.value = target.value.trimStart().replaceAll(/\s\s+/g, " ");

        // Reject all inputs that have been modified quickly, only allow last
        const cached = target.value;
        await new Promise((resolve) => setTimeout(resolve, 1000));
        if (cached !== target.value) {
            return;
        }

        // Logic starts here
        const query = target.value;

        if (query === undefined || query === null || query === "") {
            this.previewGifUrl = this.tenorService.defaultUrl;
            return;
        }
        this.tenorService.search(query).subscribe({
            next: (data) => {
                this.tenorResults = data.results;
            },
            error: (_) => {
                this.tenorResults = [];
            }
        });
    }

    async updateGifPreview(event: Event) {
        const target = event.target as HTMLInputElement;

        // Trim all spaces of input field
        target.value = target.value.replaceAll(/\s+/g, "");

        // Reject all inputs that have been modified quickly, only allow last
        const cached = target.value;
        await new Promise((resolve) => setTimeout(resolve, 1000));
        if (cached !== target.value) {
            return;
        }

        // Logic starts here
        const value = target.value;

        if (value === undefined || value === null || value === "") {
            this.previewGifUrl = this.tenorService.defaultUrl;
            return;
        }
        this.tenorService.posts([value]).subscribe({
            next: (data) => {
                this.previewGifUrl =
                    data.results.length != 0
                        ? data.results[0].media_formats.gif.url
                        : this.tenorService.defaultUrl;
            },
            error: (_) => {
                this.previewGifUrl = this.tenorService.defaultUrl;
            }
        });
    }

    tenorResultClick(result: TenorResponseObject) {
        this.newGifId = result.id;
        this.previewGifUrl = result.media_formats.gif.url;
    }

    create() {
        this.sceneService
            .createScene(
                this.parentId,
                this.newTitle,
                this.newDesc,
                this.newGifId
            )
            .subscribe({
                next: (scene) => {
                    this.router.navigate(["scene", scene.id]);
                },
                error: (res: ErrorResponse) => {
                    this.popupService.clear();
                    this.popupService.display({
                        message: res.error.error,
                        color: "red"
                    });
                }
            });
    }
}
