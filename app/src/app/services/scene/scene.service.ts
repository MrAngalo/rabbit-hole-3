import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { SceneResponse } from "./scene-types";
import { AuthService } from "../auth/auth.service";

@Injectable({
    providedIn: "root"
})
export class SceneService {
    private readonly apiUrl = "/api/";

    constructor(
        private auth: AuthService,
        private http: HttpClient
    ) {}

    fetchScene(id: number) {
        return this.http.get<SceneResponse>(`${this.apiUrl}scene/${id}`, {
            headers: {
                "Content-Type": "application/json"
            }
        });
    }

    createScene(parentId: number, title: string, desc: string, gifId: string) {
        return this.http.post<SceneResponse>(
            `${this.apiUrl}create/${parentId}`,
            {
                title,
                desc,
                gifId
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": this.auth.csrf_token
                },
                withCredentials: true
            }
        );
    }
}
