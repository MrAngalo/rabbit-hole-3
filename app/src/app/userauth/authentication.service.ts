import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, firstValueFrom } from "rxjs";

@Injectable({
    providedIn: "root"
})
export class AuthenticationService {
    private readonly apiUrl = "http://127.0.0.1:8080/api/";
    private readonly contentTypeJson = new HttpHeaders({
        "Content-Type": "application/json"
    });

    constructor(private http: HttpClient) {}

    async login(username: string, password: string) {
        return await firstValueFrom(
            this.http.post<any[]>(
                `${this.apiUrl}login/`,
                JSON.stringify({ username, password }),
                {
                    headers: this.contentTypeJson
                }
            )
        );
    }
}
