import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";

export type Scene = {};

@Injectable({
    providedIn: "root"
})
export class SceneService {
    private readonly apiUrl = "http://127.0.0.1:8080/api";

    constructor(private http: HttpClient) {}

    async fetchScene(id: number): Promise<Scene> {
        const req = this.http.get<Scene>(`${this.apiUrl}/scene/${id}`, {
            headers: {
                "Content-Type": "application/json"
            }
        });
        return new Promise((resolve, reject) => {
            req.subscribe({
                next: resolve,
                error: (data) => reject(data.error)
            });
        });
    }
}
