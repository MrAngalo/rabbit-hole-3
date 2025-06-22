import { Component } from "@angular/core";
import { UtilsPipeModule } from "../../pipes/utils/utils-pipe.module";
import { RouterModule } from "@angular/router";
import { TenorPipesModule } from "../../pipes/tenor/tenor-pipes.module";
import { CommonModule } from "@angular/common";
import { AuthService } from "../../services/auth/auth.service";
import { Observable, tap } from "rxjs";
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

@Component({
    selector: "app-account",
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        TenorPipesModule,
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

    constructor(userService: UserService) {
        this.myForm = new FormGroup({
            gifId: new FormControl("", [Validators.required]),
            biography: new FormControl("", [Validators.required]),
            awaiting_review: new FormControl("", [Validators.required])
        });

        this.settings$ = userService.fetchSettings().pipe(
            tap((s) => {
                this.myForm.setValue({
                    gifId: s.ppf_gifId,
                    biography: s.bio,
                    awaiting_review: s.view_await_review
                });
            })
        );
    }

    onSubmit() {}

    // Save form action="/modify/usersettings/<%= locals.user2.username %>" method="POST"
}
