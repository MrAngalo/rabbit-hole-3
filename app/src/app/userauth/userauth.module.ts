import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HttpClientModule } from '@angular/common/http';
import { AuthenticationService } from './authentication.service';

@NgModule({
  declarations: [AuthenticationService],
  imports: [CommonModule, HttpClientModule],
})
export class UserauthModule {}
