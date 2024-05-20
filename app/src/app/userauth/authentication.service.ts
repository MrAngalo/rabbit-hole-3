import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";

export type LoginResponse = {
    token: string;
    user: {
        username: string;
        email: string;
    };
};

@Injectable({
    providedIn: "root"
})
export class AuthenticationService {
    private readonly apiUrl = "http://127.0.0.1:8080/api";

    constructor(private http: HttpClient) {}

    login(email: string, password: string): Observable<LoginResponse> {
        const a = this.http.post<LoginResponse>(
            `${this.apiUrl}/login/`,
            JSON.stringify({ email, password }),
            {
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );
        return a;
    }
}
