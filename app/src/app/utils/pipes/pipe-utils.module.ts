import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DateSuffixPipe } from "./date-suffix/date-suffix.pipe";
import { SplitPipe } from "./split/split.pipe";
import { FormatErrorPipe } from "./format-error/format-error.pipe";

@NgModule({
    declarations: [DateSuffixPipe, SplitPipe, FormatErrorPipe],
    imports: [CommonModule],
    exports: [DateSuffixPipe, SplitPipe, FormatErrorPipe]
})
export class PipeUtilsModule {}
