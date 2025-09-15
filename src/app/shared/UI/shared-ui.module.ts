import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// PrimeNG Modules
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { FloatLabel } from 'primeng/floatlabel';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { DynamicDialogModule } from 'primeng/dynamicdialog';

// Dynamic Components
import { DynamicButtonComponent } from './button/button.component';

import {
  DynamicFloatLabelComponent,
  DynamicSelectFloatLabelComponent,
} from './floatlabel/floatlabel.component';
import { DynamicTableComponent } from './table/table/table.component';
import { CustomDialogComponent } from './custom-dialog/custom-dialog.component';
import { Dialog } from "primeng/dialog";

@NgModule({
  declarations: [
    DynamicButtonComponent,
    DynamicFloatLabelComponent,
    DynamicSelectFloatLabelComponent,
    DynamicTableComponent,
    CustomDialogComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    TableModule,
    DynamicDialogModule,
    InputTextModule,
    Select,
    FloatLabel,
    ToggleSwitchModule,
    Dialog
],
  exports: [
    // Dynamic Components
    DynamicButtonComponent,
    DynamicFloatLabelComponent,
    DynamicSelectFloatLabelComponent,
    DynamicTableComponent,

    // PrimeNG Modules (for external use)
    ButtonModule,
    TableModule,
    InputTextModule,
    Select,
    FloatLabel,
    ToggleSwitchModule,
    FormsModule,
  ],
})
export class SharedUIModule {}
