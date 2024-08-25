import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { CookieService } from "ngx-cookie-service";
import { User, UserToken } from "./userauth-types";
import { Observable, ReplaySubject, tap } from "rxjs";

@Injectable({
    providedIn: "root"
})
export class AuthService {
    private readonly apiUrl = "http://127.0.0.1:8080/api";

    private _token: string | null;
    private _user: User | null;

    private userSubject: ReplaySubject<User | null>;
    user$: Observable<User | null>;

    constructor(
        private http: HttpClient,
        private cookie: CookieService
    ) {
        this.userSubject = new ReplaySubject<User | null>(1);
        this.user$ = this.userSubject.asObservable();

        const t = this.cookie.get("token");
        const u = this.cookie.get("user");
        if (t !== "" && u !== "") {
            this._token = t;
            this._user = JSON.parse(u);
        } else {
            this._token = null;
            this._user = null;
        }

        this.userSubject.next(this._user);
    }

    get token() {
        return this._token;
    }

    get user() {
        return this._user;
    }

    get isAuthenticated() {
        return this._token !== null;
    }

    login(email: string, password: string) {
        return this.http
            .post<UserToken>(
                `${this.apiUrl}/login/`,
                JSON.stringify({ email, password }),
                {
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            )
            .pipe(
                tap((data) => {
                    this._token = data.token;
                    this._user = data.user;
                    this.cookie.set("token", data.token);
                    this.cookie.set("user", JSON.stringify(data.user));
                    this.userSubject.next(this._user);
                })
            );
    }
}
