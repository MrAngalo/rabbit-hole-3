import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DateSuffixPipe } from "./date-suffix/date-suffix.pipe";
import { FetchPostPipe } from "./fetch-post/fetch-post.pipe";
import { FormatErrorPipe } from "./format-error/format-error.pipe";
import { OrdinalDatePipe } from "./ordinal-date/ordinal-date.pipe";
import { RangePipe } from "./range/range.pipe";
import { SplitPipe } from "./split/split.pipe";

@NgModule({
    declarations: [
        DateSuffixPipe,
        FetchPostPipe,
        FormatErrorPipe,
        OrdinalDatePipe,
        RangePipe,
        SplitPipe
    ],
    imports: [CommonModule],
    exports: [
        DateSuffixPipe,
        FetchPostPipe,
        FormatErrorPipe,
        OrdinalDatePipe,
        RangePipe,
        SplitPipe
    ]
})
export class PipeUtilsModule {}
