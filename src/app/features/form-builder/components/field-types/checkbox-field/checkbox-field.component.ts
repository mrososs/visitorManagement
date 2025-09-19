import { Component, input } from '@angular/core';
import { FormField } from '../../../models/field';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-checkbox-field',
  imports: [MatCheckboxModule],
  template: `
    <mat-checkbox [required]="field().required">
      {{ field().label }}
    </mat-checkbox>
  `,
  styles: ``,
})
export class CheckboxFieldComponent {
  field = input.required<FormField>();
}
