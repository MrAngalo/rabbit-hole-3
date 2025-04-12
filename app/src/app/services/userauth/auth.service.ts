import { Inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { CookieService } from "ngx-cookie-service";
import {
    LoginResponse,
    RegisterResponse,
    User,
    UserInfoResponse
} from "./userauth-types";
import { Observable, ReplaySubject, tap } from "rxjs";
import { DeclaredData } from "../../app.config";

@Injectable({
    providedIn: "root"
})
export class AuthService {
    private readonly apiUrl = "/api/auth/";

    private _token: string | null;
    private _user: User | null;

    private userSubject: ReplaySubject<User | null>;
    user$: Observable<User | null>;

    constructor(
        private http: HttpClient,
        private cookie: CookieService,
        @Inject("DATA") private data: DeclaredData
    ) {
        this.userSubject = new ReplaySubject<User | null>(1);
        this.user$ = this.userSubject.asObservable();
        this._token = null;
        this._user = null;

        if (!this.cookie.check("token")) {
            this.userSubject.next(this._user);
            return;
        }

        const t = this.cookie.get("token");
        this.userInfo(t).subscribe({
            next: (data) => {
                this._token = t;
                this._user = data.user;
                this.userSubject.next(this._user);
            },
            error: (data) => {
                this.cookie.delete("token");
                this.userSubject.next(this._user);
            }
        });
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
            .post<LoginResponse>(
                `${this.apiUrl}login/`,
                {
                    email,
                    password
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        "X-CSRFToken": this.data.csrf_token
                    }
                }
            )
            .pipe(
                tap((data) => {
                    this._token = data.token;
                    this._user = data.user;
                    this.cookie.set("token", data.token, { path: "/" });
                    this.userSubject.next(this._user);
                })
            );
    }

    register(username: string, email: string, password: string) {
        return this.http
            .post<RegisterResponse>(
                `${this.apiUrl}register/`,
                {
                    username,
                    email,
                    password
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        "X-CSRFToken": this.data.csrf_token
                    }
                }
            )
            .pipe(
                tap((data) => {
                    this._token = data.token;
                    this._user = data.user;
                    this.cookie.set("token", data.token, { path: "/" });
                    this.userSubject.next(this._user);
                })
            );
    }

    logout() {
        return this.http
            .post(
                `${this.apiUrl}logout/`,
                {},
                {
                    headers: {
                        "Content-Type": "application/json",
                        "X-CSRFToken": this.data.csrf_token,
                        Authorization: `token ${this._token}`
                    }
                }
            )
            .pipe(
                tap(() => {
                    this._token = null;
                    this._user = null;
                    this.cookie.delete("token");
                    this.userSubject.next(this._user);
                })
            );
    }

    private userInfo(t: string) {
        return this.http.get<UserInfoResponse>(`${this.apiUrl}user-info/`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `token ${t}`
            }
        });
    }
}
