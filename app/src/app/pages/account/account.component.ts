import { Component } from "@angular/core";
import { UtilsPipeModule } from "../../pipes/utils/utils-pipe.module";
import { RouterModule } from "@angular/router";
import { TenorPipesModule } from "../../pipes/tenor/tenor-pipes.module";
import { CommonModule } from "@angular/common";
import { AuthService } from "../../services/auth/auth.service";
import { mergeMap, Observable } from "rxjs";
import { User } from "../../services/auth/auth-types";
import {
    FetchUserResponse,
    UserPremission
} from "../../services/user/user-types";
import { UserService } from "../../services/user/user.service";
import { TenorSelectorComponent } from "../../utils/forms/tenor-selector/tenor-selector.component";

@Component({
    selector: "app-account",
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        TenorPipesModule,
        UtilsPipeModule,
        TenorSelectorComponent
    ],
    templateUrl: "./account.component.html",
    styleUrl: "./account.component.scss"
})
export class AccountComponent {
    UserPremission = UserPremission;
    reqUser$: Observable<FetchUserResponse>;

    currentUser$: Observable<User | null>;

    constructor(auth: AuthService, userService: UserService) {
        this.currentUser$ = auth.user$;
        this.reqUser$ = this.currentUser$.pipe(
            mergeMap((user) => userService.fetchUser(user!.username))
        );
    }

    // Save form action="/modify/usersettings/<%= locals.user2.username %>" method="POST"
}
