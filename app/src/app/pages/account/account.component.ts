import { Component } from "@angular/core";
import { UtilsPipeModule } from "../../pipes/utils/utils-pipe.module";
import { Router, RouterModule } from "@angular/router";
import { CommonModule } from "@angular/common";
import { concatWith, map, Observable, tap } from "rxjs";
import {
    FetchSettingsResponse,
    UserPremission
} from "../../services/user/user-types";
import { UserService } from "../../services/user/user.service";
import { TenorSelectorComponent } from "../../utils/forms/tenor-selector/tenor-selector.component";
import {
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators
} from "@angular/forms";
import { PopupMessagesService } from "../../services/popup-messages/popup-messages.service";

@Component({
    selector: "app-account",
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        UtilsPipeModule,
        ReactiveFormsModule,
        TenorSelectorComponent
    ],
    templateUrl: "./account.component.html",
    styleUrl: "./account.component.scss"
})
export class AccountComponent {
    UserPremission = UserPremission;
    settings$: Observable<FetchSettingsResponse>;

    myForm!: FormGroup;

    private originalSettings!: FetchSettingsResponse;

    constructor(
        private userService: UserService,
        private router: Router,
        private popupService: PopupMessagesService
    ) {
        this.myForm = new FormGroup({
            gifId: new FormControl([Validators.required]),
            biography: new FormControl([Validators.required]),
            awaiting_review: new FormControl([Validators.required])
        });

        this.settings$ = this.userService.fetchSettings().pipe(
            tap((s) => {
                this.originalSettings = s;
                this.myForm.setValue({
                    gifId: s.ppf_gifId,
                    biography: s.bio,
                    awaiting_review: s.view_await_review
                });
            }),
            concatWith(
                this.myForm.valueChanges.pipe(
                    map((values) => ({
                        ...this.originalSettings,
                        ppf_gifId: values.gifId,
                        bio: values.biography,
                        view_await_review: values.awaiting_review
                    }))
                )
            )
        );
    }

    onSubmit() {
        const { gifId, biography, awaiting_review } = this.myForm.value;
        this.userService
            .saveSettings(gifId, biography, awaiting_review)
            .subscribe({
                next: (res) => {
                    this.popupService.clear();
                    this.popupService.display({
                        message: "Successfully saved settings",
                        color: "red"
                    });
                },
                error: (res: any) => {
                    this.popupService.clear();
                    this.popupService.display({
                        message: res.error.error,
                        color: "red"
                    });
                }
            });
    }

    initialValues() {
        const s = this.originalSettings;
        setTimeout(() =>
            this.myForm.setValue({
                gifId: s.ppf_gifId,
                biography: s.bio,
                awaiting_review: s.view_await_review
            })
        );
    }
}
