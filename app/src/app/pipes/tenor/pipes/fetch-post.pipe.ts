import { Pipe, PipeTransform } from "@angular/core";
import { TenorService } from "../../../services/tenor/tenor.service";
import { Observable, catchError, map, of } from "rxjs";

@Pipe({
    name: "fetchPost"
})
export class FetchPostPipe implements PipeTransform {
    readonly defaultUrl = "/assets/img/no-gif.png";

    constructor(private tenorService: TenorService) {}

    transform(value: string): Observable<string> {
        if (value === undefined || value === null || value === "") {
            return of(this.defaultUrl);
        }
        return this.tenorService.fetchPost([value]).pipe(
            map((data) => data.results[0].media_formats.gif.url),
            catchError(() => of(this.defaultUrl))
        );
    }
}
