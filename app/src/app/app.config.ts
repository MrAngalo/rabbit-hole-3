import { ApplicationConfig } from "@angular/core";
import { provideRouter } from "@angular/router";

import { routes } from "./app.routes";
import { provideHttpClient } from "@angular/common/http";

export type DeclaredData = {
    csrf_token: string;
    maxId: number;
    count: number;
};

declare const __DATA__: DeclaredData;

export const appConfig: ApplicationConfig = {
    providers: [
        { provide: "DATA", useValue: __DATA__ },
        provideRouter(routes),
        provideHttpClient()
    ]
};
