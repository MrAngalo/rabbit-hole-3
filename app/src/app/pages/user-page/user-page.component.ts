import { Component } from "@angular/core";
import { UtilsPipeModule } from "../../pipes/utils/utils-pipe.module";
import { ActivatedRoute, Router, RouterModule } from "@angular/router";
import { TenorPipesModule } from "../../pipes/tenor/tenor-pipes.module";
import { CommonModule } from "@angular/common";
import { mergeMap, Observable } from "rxjs";
import {
    FetchUserResponse,
    UserPremission
} from "../../services/user/user-types";
import { UserService } from "../../services/user/user.service";
import { PopupMessagesService } from "../../services/popup-messages/popup-messages.service";

@Component({
    selector: "app-user-page",
    standalone: true,
    imports: [CommonModule, RouterModule, TenorPipesModule, UtilsPipeModule],
    templateUrl: "./user-page.component.html",
    styleUrl: "./user-page.component.scss"
})
export class UserPageComponent {
    UserPremission = UserPremission;
    reqUser$: Observable<FetchUserResponse>;

    constructor(
        router: Router,
        route: ActivatedRoute,
        userService: UserService,
        popupService: PopupMessagesService
    ) {
        this.reqUser$ = route.params.pipe(
            mergeMap((params) => userService.fetchUser(params["username"]))
        );

        this.reqUser$.subscribe({
            error: (data) => {
                router.navigate(["/"]);
                popupService.clear();
                popupService.display({
                    message: data.error.error,
                    color: "red"
                });
            }
        });
    }

    // Save form action="/modify/usersettings/<%= locals.user2.username %>" method="POST"
}
