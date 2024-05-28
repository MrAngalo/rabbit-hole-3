import { Component } from "@angular/core";
import { SceneResponse, SceneStatus } from "../../services/scene/scene-types";
import { ActivatedRoute, RouterModule } from "@angular/router";
import { Observable, firstValueFrom } from "rxjs";
import { SceneService } from "../../services/scene/scene.service";
import { CommonModule } from "@angular/common";
import { AuthService } from "../../services/userauth/auth.service";
import { User } from "../../services/userauth/userauth-types";
import { TenorPipesModule } from "../../pipes/tenor/tenor-pipes.module";
import { PipeUtilsModule } from "../../utils/pipes/pipe-utils.module";
import { FormsModule } from "@angular/forms";
import { FetchPostPipe } from "../../pipes/tenor/pipes/fetch-post.pipe";

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
    providers: [FetchPostPipe],
    templateUrl: "./scene-create.component.html",
    styleUrl: "./scene-create.component.scss"
})
export class SceneCreateComponent {
    user$: Observable<User>;
    SceneStatus = SceneStatus;

    parent$!: Observable<SceneResponse>;
    options = 3;

    newGifTitle: string = "";
    newGifDesc: string = "";
    newGifId: string = "";

    previewGifUrl: string;

    constructor(
        private route: ActivatedRoute,
        private authService: AuthService,
        private sceneService: SceneService,
        private fetchPostPipe: FetchPostPipe
    ) {
        this.user$ = this.authService.user$ as Observable<User>;
        this.route.params.subscribe((params) => {
            const id = params["id"];
            this.parent$ = this.sceneService.fetchScene(id);
        });
        this.previewGifUrl = this.fetchPostPipe.defaultUrl;
    }

    async updateGifId(event: Event) {
        const target = event.target as HTMLInputElement;

        // Trim all spaces of input field
        target.value = target.value.replaceAll(/\s+/g, "");

        // Reject all inputs that have been modified quickly, only allow last
        const cached = target.value;
        await new Promise((resolve) => setTimeout(resolve, 1000));
        if (cached !== target.value) {
            return;
        }

        this.fetchPostPipe
            .transform(target.value)
            .subscribe((url) => (this.previewGifUrl = url));
    }
}
