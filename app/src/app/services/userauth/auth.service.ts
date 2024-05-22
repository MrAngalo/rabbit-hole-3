import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { CookieService } from "ngx-cookie-service";
import { User, UserToken } from "../../types/models/userauth";

@Injectable({
    providedIn: "root"
})
export class AuthService {
    private readonly apiUrl = "http://127.0.0.1:8080/api";

    private _token: string | null;
    private _user: User | null;

    constructor(
        private http: HttpClient,
        private cookie: CookieService
    ) {
        const t = this.cookie.get("token");
        const u = this.cookie.get("user");
        if (t !== "" && u !== "") {
            this._token = t;
            this._user = JSON.parse(u);
        } else {
            this._token = null;
            this._user = null;
        }
    }

    get isAuthenticated() {
        return this._token !== null;
    }

    get user(): Readonly<User | null> {
        return this._user;
    }

    login(email: string, password: string): Promise<void> {
        const req = this.http.post<UserToken>(
            `${this.apiUrl}/login/`,
            JSON.stringify({ email, password }),
            {
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );
        return new Promise((resolve, reject) => {
            req.subscribe({
                next: (data) => {
                    this._token = data.token;
                    this._user = data.user;
                    this.cookie.set("token", data.token);
                    this.cookie.set("user", JSON.stringify(data.user));
                    resolve();
                },
                error: (data) => reject(data.error)
            });
        });
    }
}
