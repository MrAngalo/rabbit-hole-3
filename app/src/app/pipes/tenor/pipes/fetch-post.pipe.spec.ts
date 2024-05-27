import { inject } from "@angular/core";
import { FetchPostPipe } from "./fetch-post.pipe";
import { TenorService } from "../../../services/tenor/tenor.service";

describe("FetchPostPipe", () => {
    it("create an instance", () => {
        const pipe = new FetchPostPipe(inject(TenorService));
        expect(pipe).toBeTruthy();
    });
});
