import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { CookieService } from "ngx-cookie-service";

export type User = {
    username: string;
    email: string;
};

export type UserToken = {
    user: User;
    token: string;
};

@Injectable({
    providedIn: "root"
})
export class AuthService {
    private readonly apiUrl = "http://127.0.0.1:8080/api";

    private token: string | null;
    private user: User | null;

    constructor(
        private http: HttpClient,
        private cookie: CookieService
    ) {
        const t = this.cookie.get("token");
        const u = this.cookie.get("user");
        if (t !== "" && u !== "") {
            this.token = t;
            this.user = JSON.parse(u);
        } else {
            this.token = null;
            this.user = null;
        }
    }

    get isAuthenticated() {
        return this.token !== null;
    }

    login(email: string, password: string) {
        const a = this.http.post<UserToken>(
            `${this.apiUrl}/login/`,
            JSON.stringify({ email, password }),
            {
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );
        return new Promise<void>((resolve, reject) => {
            a.subscribe({
                next: (data) => {
                    this.token = data.token;
                    this.user = data.user;
                    this.cookie.set("token", data.token);
                    this.cookie.set("user", JSON.stringify(data.user));
                    resolve();
                },
                error: (data) => reject(data.error)
            });
        });
    }
}
