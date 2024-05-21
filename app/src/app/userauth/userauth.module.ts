import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";

import { HttpClientModule } from "@angular/common/http";
import { AuthService } from "./services/auth.service";

@NgModule({
    declarations: [AuthService],
    imports: [CommonModule, HttpClientModule]
})
export class UserauthModule {}
