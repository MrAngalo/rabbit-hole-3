import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Scene } from "../../types/models/scene";
import { tap } from "rxjs";

@Injectable({
    providedIn: "root"
})
export class SceneService {
    private readonly apiUrl = "http://127.0.0.1:8080/api";

    constructor(private http: HttpClient) {}

    fetchScene(id: number) {
        return this.http.get<Scene>(`${this.apiUrl}/scene/${id}`, {
            headers: {
                "Content-Type": "application/json"
            }
        });
    }
}
