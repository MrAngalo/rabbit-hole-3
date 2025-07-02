import { Inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import {
    LoginResponse,
    RegisterResponse,
    User,
    UserInfoResponse
} from "./auth-types";
import { Observable, OperatorFunction, ReplaySubject, tap } from "rxjs";
import { DeclaredData } from "../../app.config";
import { CookieService } from "ngx-cookie-service";

@Injectable({
    providedIn: "root"
})
export class AuthService {
    private readonly apiUrl = "/api/auth/";

    private _csrfToken: string | null;
    private _user: User | null;

    private userSubject: ReplaySubject<User | null>;
    user$: Observable<User | null>;

    constructor(
        @Inject("DATA") private data: DeclaredData,
        private cookie: CookieService,
        private http: HttpClient
    ) {
        this._csrfToken = this.data.csrf_token;
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

    get csrfToken() {
        if (this._csrfToken === null) {
            this._csrfToken = this.cookie.get("csrftoken");
        }
        return this._csrfToken;
    }

    get user() {
        return this._user;
    }

    get isAuthenticated() {
        return this._user !== null;
    }

    discartCsrfToken<T>(): OperatorFunction<T, T> {
        return tap((_) => (this._csrfToken = null));
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
                        "X-CSRFToken": this.csrfToken
                    },
                    withCredentials: false
                }
            )
            .pipe(
                this.discartCsrfToken(),
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
                        "X-CSRFToken": this.csrfToken
                    },
                    withCredentials: false
                }
            )
            .pipe(
                this.discartCsrfToken(),
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
                        "X-CSRFToken": this.csrfToken
                    },
                    withCredentials: true
                }
            )
            .pipe(
                this.discartCsrfToken(),
                tap(() => {
                    this._user = null;
                    this.userSubject.next(this._user);
                })
            );
    }

    passwordReset(email: string) {
        return this.http
            .post<LoginResponse>(
                `${this.apiUrl}pwreset/`,
                {
                    email
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        "X-CSRFToken": this.csrfToken
                    },
                    withCredentials: false
                }
            )
            .pipe(this.discartCsrfToken());
    }

    passwordVerify(
        email: string,
        password1: string,
        password2: string,
        token: string
    ) {
        return this.http
            .post<LoginResponse>(
                `${this.apiUrl}pwverify/`,
                {
                    email,
                    password1,
                    password2,
                    token
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        "X-CSRFToken": this.csrfToken
                    },
                    withCredentials: false
                }
            )
            .pipe(this.discartCsrfToken());
    }

    private userInfo() {
        return this.http
            .get<UserInfoResponse>(`${this.apiUrl}user-info/`, {
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": this.csrfToken
                },
                withCredentials: true
            })
            .pipe(this.discartCsrfToken());
    }
}
