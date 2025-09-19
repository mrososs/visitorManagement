import { Component, input } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { FormField } from '../../../models/field';

@Component({
  selector: 'app-email-field',
  imports: [MatFormFieldModule, MatInputModule, MatIconModule],
  template: `
    <mat-form-field class="w-full">
      <mat-label>{{ field().label }}</mat-label>
      <input
        matInput
        type="email"
        [required]="field().required"
        [placeholder]="field().placeholder || 'Enter your email'"
      />
      <mat-icon matSuffix>email</mat-icon>
    </mat-form-field>
  `,
  styles: ``,
})
export class EmailFieldComponent {
  field = input.required<FormField>();
}
