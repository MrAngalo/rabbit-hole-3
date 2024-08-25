import { Pipe, PipeTransform } from "@angular/core";
import { TenorService } from "../../../services/tenor/tenor.service";
import { Observable, catchError, map, of } from "rxjs";

@Pipe({
    name: "fetchPost"
})
export class FetchPostPipe implements PipeTransform {
    constructor(private tenorService: TenorService) {}

    transform(value: string): Observable<string> {
        if (value === undefined || value === null || value === "") {
            return of(this.tenorService.defaultUrl);
        }
        return this.tenorService.posts([value]).pipe(
            map((data) => data.results[0].media_formats.gif.url),
            catchError(() => of(this.tenorService.defaultUrl))
        );
    }
}
