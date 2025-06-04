import { Inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { SceneGlobalsResponse, SceneResponse } from "./scene-types";
import { Observable } from "rxjs";
import { AuthService } from "../auth/auth.service";
import { DeclaredData } from "../../app.config";

@Injectable({
    providedIn: "root"
})
export class SceneService {
    private readonly API_URL = "/api";

    constructor(
        @Inject("DATA") private data: DeclaredData,
        private authService: AuthService,
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
        const token = this.authService.token;
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
                    Authorization: `token ${token}`
                }
            }
        );
    }
}
