import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DateSuffixPipe } from "./date-suffix/date-suffix.pipe";
import { SplitPipe } from "./split/split.pipe";

@NgModule({
    declarations: [DateSuffixPipe, SplitPipe],
    imports: [CommonModule],
    exports: [DateSuffixPipe, SplitPipe]
})
export class PipeUtilsModule {}
