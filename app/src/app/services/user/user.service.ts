import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { FetchUserResponse } from "./user-types";
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
                withCredentials: this.auth.isAuthenticated
            }
        );
    }
}
