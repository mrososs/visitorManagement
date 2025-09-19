import { Component, computed, inject, input } from '@angular/core';
import { FormField } from '../../../models/field';
import { FieldTypesService } from '../../../services/field-types.service';
import { NgComponentOutlet, TitleCasePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FormService } from '../../../services/form.service';
import { FieldPreviewComponent } from '../field-preview/field-preview.component';
import { FieldSettingsComponent } from '../../field-settings/field-settings.component';

@Component({
  selector: 'app-form-field',
  imports: [
    TitleCasePipe,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    FieldPreviewComponent,
  ],
  template: `
    <div
      class="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:border-black cursor-pointer"
      [class]="
        formService.selectField()?.id === field().id ? '!border-black' : ''
      "
      (click)="formService.setSelectedField(field().id)"
    >
      <div class="flex justify-between items-center mb-1 ">
        <span class="text-sm">{{ field().type | titlecase }}</span>
        <div class="flex items-center gap-1">
          <button mat-icon-button (click)="openSettings($event)">
            <mat-icon>settings</mat-icon>
          </button>
          <button mat-icon-button (click)="deleteField($event)">
            <mat-icon class="mr-2">delete</mat-icon>
          </button>
        </div>
      </div>
      <app-field-preview [field]="field()" />
    </div>
  `,
  styles: ``,
})
export class FormFieldComponent {
  field = input.required<FormField>();
  formService = inject(FormService);
  private dialog = inject(MatDialog);

  deleteField(event: Event) {
    event.stopPropagation();
    this.formService.deleteField(this.field().id);
  }

  openSettings(event: Event) {
    event.stopPropagation();
    this.formService.setSelectedField(this.field().id);
    this.dialog.open(FieldSettingsComponent, {
      width: '720px',
      maxWidth: '96vw',
      maxHeight: '90vh',
      panelClass: 'rounded-dialog',
      enterAnimationDuration: '150ms',
      exitAnimationDuration: '100ms',
    });
  }
}
