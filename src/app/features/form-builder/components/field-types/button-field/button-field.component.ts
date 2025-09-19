import { Component, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { FormField } from '../../../models/field';

@Component({
  selector: 'app-button-field',
  imports: [MatButtonModule],
  template: `
    <div
      class="button-container"
      [class]="'align-' + (field().alignment || 'right')"
    >
      <button
        mat-raised-button
        color="primary"
        type="submit"
        class="submit-button"
      >
        {{ field().buttonText || 'Submit' }}
      </button>
      @if (field().showCancelButton) {
      <button
        mat-stroked-button
        type="button"
        class="cancel-button"
        style="margin-left: 8px;"
      >
        Cancel
      </button>
      }
    </div>
  `,
  styles: `
    .button-container {
      display: flex;
      gap: 8px;
      margin: 16px 0;
    }
    
    .align-left {
      justify-content: flex-start;
    }
    
    .align-center {
      justify-content: center;
    }
    
    .align-right {
      justify-content: flex-end;
    }
    
    .submit-button {
      min-width: 120px;
    }
    
    .cancel-button {
      min-width: 120px;
    }
  `,
})
export class ButtonFieldComponent {
  field = input.required<FormField>();
}
