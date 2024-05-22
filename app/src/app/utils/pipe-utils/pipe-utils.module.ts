import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DateSuffixPipe } from "./pipes/date-suffix.pipe";
import { SplitPipe } from "./pipes/split.pipe";

@NgModule({
    declarations: [DateSuffixPipe, SplitPipe],
    imports: [CommonModule],
    exports: [DateSuffixPipe, SplitPipe]
})
export class PipeUtilsModule {}
