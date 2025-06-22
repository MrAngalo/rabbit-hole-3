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
        return this.http.get<FetchUserResponse>(
            `${this.apiUrl}user/${username}`,
            {
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": this.auth.csrf_token
                },
                withCredentials: false
            }
        );
    }

    fetchSettings() {
        return this.http.get<FetchSettingsResponse>(`${this.apiUrl}account/`, {
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": this.auth.csrf_token
            },
            withCredentials: true
        });
    }

    saveSettings(gifId: string, biography: string, awaiting_review: string) {
        return this.http.post<SaveSettingsResponse>(
            `${this.apiUrl}account/`,
            {
                gifId,
                biography,
                awaiting_review
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": this.auth.csrf_token
                },
                withCredentials: true
            }
        );
    }
}
