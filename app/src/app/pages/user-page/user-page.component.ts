import { Component } from "@angular/core";
import { UtilsPipeModule } from "../../pipes/utils/utils-pipe.module";
import { ActivatedRoute, RouterModule } from "@angular/router";
import { TenorPipesModule } from "../../pipes/tenor/tenor-pipes.module";
import { CommonModule } from "@angular/common";
import { AuthService } from "../../services/auth/auth.service";
import { Observable } from "rxjs";
import { User } from "../../services/auth/auth-types";
import {
    FetchUserResponse,
    UserPremission
} from "../../services/user/user-types";
import { UserService } from "../../services/user/user.service";

@Component({
    selector: "app-user-page",
    standalone: true,
    imports: [CommonModule, RouterModule, TenorPipesModule, UtilsPipeModule],
    templateUrl: "./user-page.component.html",
    styleUrl: "./user-page.component.scss"
})
export class UserPageComponent {
    UserPremission = UserPremission;
    reqUser: FetchUserResponse = {
        id: "1",
        username: "MrAngalo",
        permission: UserPremission.ADMINISTRATOR,
        created: new Date("2024-05-13T22:44:05"),
        bio: "I have the first, I have seen everything",
        ppf_gifId: "24379514",
        scenes: [
            {
                id: "0",
                title: "The Mischievous Forest",
                gifId: "16992587"
            },
            {
                id: "16",
                title: "Do nothing",
                gifId: "17868304"
            }
        ]
    };

    currentUser$: Observable<User | null>;

    constructor(
        route: ActivatedRoute,
        auth: AuthService,
        userService: UserService
    ) {
        this.currentUser$ = auth.user$;

        route.params.subscribe((params) => {
            const username = params["username"];
            userService.fetchUser(username).subscribe((user) => {
                console.log("success!");
                console.log(user);
            });
        });
    }

    // Save form action="/modify/usersettings/<%= locals.user2.username %>" method="POST"
}
