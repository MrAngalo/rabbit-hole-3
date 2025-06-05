import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { SceneResponse } from "./scene-types";
import { AuthService } from "../auth/auth.service";

@Injectable({
    providedIn: "root"
})
export class SceneService {
    private readonly API_URL = "/api";

    constructor(
        private auth: AuthService,
        private http: HttpClient
    ) {}

    fetchScene(id: number) {
        return this.http.get<SceneResponse>(`${this.API_URL}/scene/${id}`, {
            headers: {
                "Content-Type": "application/json"
            }
        });
    }

    createScene(parentId: number, title: string, desc: string, gifId: string) {
        return this.http.post<SceneResponse>(
            `${this.API_URL}/create/${parentId}`,
            {
                title,
                desc,
                gifId
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `token ${this.auth.csrf_token}`
                },
                withCredentials: true
            }
        );
    }
}
