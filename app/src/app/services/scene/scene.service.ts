import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { SceneGlobalsResponse, SceneResponse } from "./scene-types";

@Injectable({
    providedIn: "root"
})
export class SceneService {
    private readonly apiUrl = "http://127.0.0.1:8080/api";

    constructor(private http: HttpClient) {}

    fetchScene(id: number) {
        return this.http.get<SceneResponse>(`${this.apiUrl}/scene/${id}`, {
            headers: {
                "Content-Type": "application/json"
            }
        });
    }

    fetchSceneGlobals() {
        return this.http.get<SceneGlobalsResponse>(
            `${this.apiUrl}/scene-globals`,
            {
                headers: {
                    "Content-Type": "application/json"
                }
            }
        );
    }
}
