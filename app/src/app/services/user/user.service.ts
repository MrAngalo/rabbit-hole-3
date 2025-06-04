import { Inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { DeclaredData } from "../../app.config";
import { FetchUserResponse } from "./user-types";
import { AuthService } from "../auth/auth.service";

@Injectable({
    providedIn: "root"
})
export class UserService {
    private readonly apiUrl = "/api/";

    constructor(
        @Inject("DATA") private data: DeclaredData,
        private auth: AuthService,
        private http: HttpClient
    ) {}

    fetchUser(username: string) {
        return this.http.get<FetchUserResponse>(
            `${this.apiUrl}user/${username}`,
            {
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": this.data.csrf_token,
                    ...(this.auth.token
                        ? {
                              Authorization: `token ${this.auth.token}`
                          }
                        : {})
                }
            }
        );
    }
}
