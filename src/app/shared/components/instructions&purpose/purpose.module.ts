import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PurposeComponent } from './purpose/purpose.component';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { FloatLabel } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { TableModule } from 'primeng/table';

@NgModule({
  declarations: [PurposeComponent],
  imports: [
    CommonModule,
    ButtonModule,
    TableModule,
    InputTextModule,
    Select,
    FloatLabel,
    FormsModule,
  ],
  exports: [PurposeComponent],
})
export class PurposeModule {}
