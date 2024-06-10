import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { TenorPostsResponse } from "./tenor-types";

@Injectable({
    providedIn: "root"
})
export class TenorService {
    private readonly apiUrl = "http://127.0.0.1:8080/api/tenor";
    private readonly clientKey = "webclient";

    readonly defaultUrl = "/assets/img/no-gif.png";

    constructor(private http: HttpClient) {}

    posts(ids: string[]) {
        return this.http.get<TenorPostsResponse>(
            `${this.apiUrl}/posts/?client_key=${this.clientKey}&ids=${ids.join()}`,
            {
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );
    }

    search(query: string) {
        return this.http.get<TenorPostsResponse>(
            `${this.apiUrl}/search/?client_key=${this.clientKey}&q=${query}`,
            {
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );
    }
}
