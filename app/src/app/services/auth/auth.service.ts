import { Inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { CookieService } from "ngx-cookie-service";
import {
    LoginResponse,
    RegisterResponse,
    User,
    UserInfoResponse
} from "./auth-types";
import { Observable, ReplaySubject, tap } from "rxjs";
import { DeclaredData } from "../../app.config";

@Injectable({
    providedIn: "root"
})
export class AuthService {
    private readonly apiUrl = "/api/auth/";

    private _csrf_token: string;
    private _user: User | null;

    private userSubject: ReplaySubject<User | null>;
    user$: Observable<User | null>;

    constructor(
        @Inject("DATA") private data: DeclaredData,
        private http: HttpClient,
        private cookie: CookieService
    ) {
        this._csrf_token = this.data.csrf_token;
        this._user = null;

        this.userSubject = new ReplaySubject<User | null>(1);
        this.user$ = this.userSubject.asObservable();

        this.userInfo().subscribe({
            next: (data) => {
                this._user = data.user;
                this.userSubject.next(this._user);
            },
            error: (_) => {
                this._user = null;
                this.userSubject.next(this._user);
            }
        });
    }

    get csrf_token() {
        return this._csrf_token;
    }

    get user() {
        return this._user;
    }

    get isAuthenticated() {
        return this._user !== null;
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
                        "X-CSRFToken": this.csrf_token
                    },
                    withCredentials: false
                }
            )
            .pipe(
                tap((data) => {
                    this._user = data.user;
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
                        "X-CSRFToken": this.csrf_token
                    },
                    withCredentials: false
                }
            )
            .pipe(
                tap((data) => {
                    this._user = data.user;
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
                        "X-CSRFToken": this.csrf_token
                    },
                    withCredentials: true
                }
            )
            .pipe(
                tap(() => {
                    this._user = null;
                    this.userSubject.next(this._user);
                })
            );
    }

    private userInfo() {
        return this.http.get<UserInfoResponse>(`${this.apiUrl}user-info/`, {
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": this.csrf_token
            },
            withCredentials: true
        });
    }
}
