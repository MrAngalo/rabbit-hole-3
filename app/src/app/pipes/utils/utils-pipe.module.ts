import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { OrdinalDatePipe } from "./ordinal-date/ordinal-date.pipe";
import { RangePipe } from "./range/range.pipe";

@NgModule({
    declarations: [OrdinalDatePipe, RangePipe],
    imports: [CommonModule],
    exports: [OrdinalDatePipe, RangePipe]
})
export class UtilsPipeModule {}
