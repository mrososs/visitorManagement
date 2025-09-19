import { Component, input } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormField } from '../../../models/field';
@Component({
  selector: 'app-text-field',
  imports: [MatFormFieldModule, MatInputModule],
  template: `
    <mat-form-field class="w-full">
      <mat-label>{{ field().label }}</mat-label>
      <input
        matInput
        [type]="field().inputType || 'text'"
        [required]="field().required"
        [placeholder]="field().placeholder || ''"
      />
    </mat-form-field>
  `,
  styles: ``,
})
export class TextFieldComponent {
  field = input.required<FormField>();
}
