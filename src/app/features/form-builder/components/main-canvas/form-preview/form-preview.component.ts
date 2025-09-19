import { FormService } from './../../../services/form.service';
import { Component, inject, computed } from '@angular/core';
import { FieldPreviewComponent } from '../field-preview/field-preview.component';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-form-preview',
  imports: [FieldPreviewComponent, MatIconModule],
  template: `
    <div class="form-preview-container w-full">
      <div class="form-preview-content">
        @if (hasFields()) { @for (row of formService.rows(); track row.id) { @if
        (row.fields.length > 0) {
        <div class="form-row-preview">
          @for (field of row.fields; track field.id) {
          <div class="field-preview-wrapper">
            <app-field-preview [field]="field" />
          </div>
          }
        </div>
        } } } @else {
        <div class="empty-form">
          <div class="empty-icon">
            <mat-icon> insert_drive_file</mat-icon>
          </div>
          <h3 class="empty-title">No Form Fields</h3>
          <p class="empty-text">
            Drag and drop form elements from the left panel to start building
            your form
          </p>
        </div>
        }
      </div>
    </div>
  `,
  styles: `
    .form-preview-container {
      display: flex;
      flex-direction: column;
      height: 100%;
      min-height: 0;
    }

    .form-preview-content {
      background: white;
      border-radius: 16px;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
      padding: 24px;
      flex: 1;
      min-height: 0;
      overflow: auto;
    }

    .form-row-preview {
      display: flex;
      gap: 20px;
      flex-wrap: wrap;
      margin-bottom: 24px;
    }

    .form-row-preview:last-child {
      margin-bottom: 0;
    }

    .field-preview-wrapper {
      flex: 1;
      min-width: 250px;
    }

    .empty-form {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 60px 20px;
      color: #6b7280;
    }

    .empty-icon {
      color: #d1d5db;
      margin-bottom: 16px;
    }

    .empty-title {
      font-size: 20px;
      font-weight: 600;
      margin: 0 0 8px 0;
      color: #374151;
    }

    .empty-text {
      font-size: 14px;
      margin: 0;
      color: #6b7280;
      max-width: 300px;
      line-height: 1.5;
    }

    @media (max-width: 768px) {
      .form-preview-container {
        padding: 12px;
      }

      .form-preview-content {
        padding: 20px;
        border-radius: 12px;
      }

      .form-row-preview {
        gap: 16px;
        margin-bottom: 20px;
      }

      .field-preview-wrapper {
        min-width: 200px;
      }
    }
  `,
})
export class FormPreviewComponent {
  formService = inject(FormService);

  // Computed property to check if the form has any fields
  hasFields = computed(() => {
    const rows = this.formService.rows();
    return rows.some((row) => row.fields.length > 0);
  });
}
