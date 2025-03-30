import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { SceneGlobalsResponse, SceneResponse } from "./scene-types";
import { Observable } from "rxjs";
import { AuthService } from "../userauth/auth.service";

@Injectable({
    providedIn: "root"
})
export class SceneService {
    private readonly API_URL = "/api";

    globals$: Observable<SceneGlobalsResponse>;

    constructor(
        private authService: AuthService,
        private http: HttpClient
    ) {
        this.globals$ = this.fetchSceneGlobals();
    }

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

    private fetchSceneGlobals() {
        return this.http.get<SceneGlobalsResponse>(
            `${this.API_URL}/scene-globals`,
            {
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );
    }
}
