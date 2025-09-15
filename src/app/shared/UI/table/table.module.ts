import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { FloatLabel } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { ToggleSwitchModule } from 'primeng/toggleswitch';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ButtonModule,
    TableModule,
    InputTextModule,
    Select,
    FloatLabel,
    FormsModule,
    ToggleSwitchModule,
  ],
  exports: [
    ButtonModule,
    TableModule,
    InputTextModule,
    Select,
    FloatLabel,
    FormsModule,
    ToggleSwitchModule,
  ],
})
export class DynamicTableModule {}
