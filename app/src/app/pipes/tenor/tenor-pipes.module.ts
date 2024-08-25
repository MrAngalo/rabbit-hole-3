import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FetchPostPipe } from "./pipes/fetch-post.pipe";

@NgModule({
    declarations: [FetchPostPipe],
    imports: [CommonModule],
    exports: [FetchPostPipe]
})
export class TenorPipesModule {}
