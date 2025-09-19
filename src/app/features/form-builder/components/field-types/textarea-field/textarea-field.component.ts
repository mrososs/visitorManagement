import { Component, input } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormField } from '../../../models/field';

@Component({
  selector: 'app-textarea-field',
  imports: [MatFormFieldModule, MatInputModule],
  template: `
    <mat-form-field class="w-full">
      <mat-label>{{ field().label }}</mat-label>
      <textarea
        matInput
        [required]="field().required"
        [rows]="field().rows || 4"
        [placeholder]="field().placeholder || 'Enter your text here...'"
      >
      </textarea>
    </mat-form-field>
  `,
  styles: ``,
})
export class TextareaFieldComponent {
  field = input.required<FormField>();
}
