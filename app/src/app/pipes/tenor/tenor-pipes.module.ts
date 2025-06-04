import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FetchPostPipe } from "./fetch-post/fetch-post.pipe";

@NgModule({
    declarations: [FetchPostPipe],
    imports: [CommonModule],
    exports: [FetchPostPipe]
})
export class TenorPipesModule {}
