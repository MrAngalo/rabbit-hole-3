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
import { PipeUtilsModule } from "../../utils/pipes/pipe-utils.module";
import {
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators
} from "@angular/forms";
import { PopupMessagesService } from "../../services/popup-messages/popup-messages.service";
import { TenorSelectorComponent } from "../../utils/forms/tenor-selector/tenor-selector.component";

@Component({
    selector: "app-scene-create",
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        PipeUtilsModule,
        ReactiveFormsModule,
        TenorSelectorComponent
    ],
    templateUrl: "./scene-create.component.html",
    styleUrl: "./scene-create.component.scss"
})
export class SceneCreateComponent {
    user$: Observable<User>;
    SceneStatus = SceneStatus;

    parentId: string;
    parent: SceneResponse | null = null;
    options = 3;

    form: FormGroup;

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private authService: AuthService,
        private sceneService: SceneService,
        private popupService: PopupMessagesService
    ) {
        this.user$ = this.authService.user$ as Observable<User>;
        this.parentId = this.route.snapshot.paramMap.get("id")!;
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

        this.form = new FormGroup({
            title: new FormControl("", [Validators.required]),
            description: new FormControl("", [Validators.required]),
            gifId: new FormControl("", [Validators.required])
        });
    }

    create() {
        const { title, description, gifId } = this.form.value;

        this.sceneService
            .createScene(this.parentId, title, description, gifId)
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
