import { Pipe, PipeTransform } from "@angular/core";
import { TenorService } from "../../../services/tenor/tenor.service";
import { Observable, map } from "rxjs";

@Pipe({
    name: "fetchPost"
})
export class FetchPostPipe implements PipeTransform {
    constructor(private tenorService: TenorService) {}

    transform(value: string): Observable<string> {
        return this.tenorService
            .fetchPost([value])
            .pipe(map((data) => data.results[0].media_formats.gif.url));
    }
}
