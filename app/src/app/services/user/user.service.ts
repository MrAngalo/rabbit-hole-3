import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import {
    FetchSettingsResponse,
    FetchUserResponse,
    SaveSettingsResponse
} from "./user-types";
import { AuthService } from "../auth/auth.service";

@Injectable({
    providedIn: "root"
})
export class UserService {
    private readonly apiUrl = "/api/";

    constructor(
        private auth: AuthService,
        private http: HttpClient
    ) {}

    fetchUser(username: string) {
        return this.http
            .get<FetchUserResponse>(`${this.apiUrl}user/${username}`, {
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": this.auth.csrfToken
                },
                withCredentials: false
            })
            .pipe(this.auth.discartCsrfToken());
    }

    fetchSettings() {
        return this.http
            .get<FetchSettingsResponse>(`${this.apiUrl}account/`, {
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": this.auth.csrfToken
                },
                withCredentials: true
            })
            .pipe(this.auth.discartCsrfToken());
    }

    saveSettings(gifId: string, biography: string, awaiting_review: string) {
        return this.http
            .post<SaveSettingsResponse>(
                `${this.apiUrl}account/`,
                {
                    gifId,
                    biography,
                    awaiting_review
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        "X-CSRFToken": this.auth.csrfToken
                    },
                    withCredentials: true
                }
            )
            .pipe(this.auth.discartCsrfToken());
    }
}
