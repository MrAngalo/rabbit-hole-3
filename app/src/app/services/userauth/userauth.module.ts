import { NgModule } from "@angular/core";

import { HttpClientModule } from "@angular/common/http";
import { AuthService } from "./auth.service";

@NgModule({
    declarations: [AuthService],
    imports: [HttpClientModule]
})
export class UserauthModule {}
