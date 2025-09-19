import { Component, inject, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgModel } from '@angular/forms';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FormField, FormDefinition } from '../../models/field';
import { FormExportService } from '../../services/form-export.service';
import { BackendApiService } from '../../services/backend-api.service';

@Component({
  selector: 'app-form-export',
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatIconModule,
    MatRadioModule,
    MatSnackBarModule,
  ],
  template: `
    <div class="export-dialog">
      <div class="export-header">
        <h2 class="export-title">Export Form</h2>
        <button mat-icon-button (click)="close()" class="close-btn">
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <div class="export-content">
        <div class="form-settings">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Form Name</mat-label>
            <input
              matInput
              [(ngModel)]="formName"
              #formNameModel="ngModel"
              name="formName"
              (ngModelChange)="onFormNameChange()"
              placeholder="Enter form name"
              required
            />
            <mat-error *ngIf="formNameModel?.invalid && formNameError">
              {{ formNameError }}
            </mat-error>
          </mat-form-field>
        </div>

        <div class="validation-section">
          <h3 class="section-title">Field Validation Settings</h3>
          <div class="fields-list">
            <div *ngFor="let field of fields" class="field-item">
              <div
                class="field-header"
                (click)="toggleFieldValidation(field.id)"
              >
                <mat-icon>{{ getFieldIcon(field.type) }}</mat-icon>
                <span class="field-label">{{ field.label }}</span>
                <mat-icon class="expand-icon">{{
                  isFieldExpanded(field.id) ? 'expand_less' : 'expand_more'
                }}</mat-icon>
              </div>

              <div *ngIf="isFieldExpanded(field.id)" class="field-validation">
                <div class="validation-options">
                  <mat-checkbox
                    [(ngModel)]="field.required"
                    class="validation-checkbox"
                  >
                    Required
                  </mat-checkbox>

                  <div
                    *ngIf="
                      field.type === 'text' ||
                      field.type === 'textarea' ||
                      field.type === 'email' ||
                      field.type === 'password'
                    "
                    class="validation-row"
                  >
                    <mat-form-field appearance="outline">
                      <mat-label>Min Length</mat-label>
                      <input
                        matInput
                        type="number"
                        [ngModel]="getValidationValue(field, 'minLength')"
                        (ngModelChange)="
                          setValidationValue(field, 'minLength', $event)
                        "
                        min="0"
                      />
                    </mat-form-field>
                    <mat-form-field appearance="outline">
                      <mat-label>Max Length</mat-label>
                      <input
                        matInput
                        type="number"
                        [ngModel]="getValidationValue(field, 'maxLength')"
                        (ngModelChange)="
                          setValidationValue(field, 'maxLength', $event)
                        "
                        min="0"
                      />
                    </mat-form-field>
                  </div>

                  <div *ngIf="field.type === 'number'" class="validation-row">
                    <mat-form-field appearance="outline">
                      <mat-label>Min Value</mat-label>
                      <input
                        matInput
                        type="number"
                        [ngModel]="getValidationValue(field, 'min')"
                        (ngModelChange)="
                          setValidationValue(field, 'min', $event)
                        "
                      />
                    </mat-form-field>
                    <mat-form-field appearance="outline">
                      <mat-label>Max Value</mat-label>
                      <input
                        matInput
                        type="number"
                        [ngModel]="getValidationValue(field, 'max')"
                        (ngModelChange)="
                          setValidationValue(field, 'max', $event)
                        "
                      />
                    </mat-form-field>
                  </div>

                  <mat-form-field
                    *ngIf="field.type === 'text' || field.type === 'email'"
                    appearance="outline"
                    class="full-width"
                  >
                    <mat-label>Pattern (Regex)</mat-label>
                    <input
                      matInput
                      [ngModel]="getValidationValue(field, 'pattern')"
                      (ngModelChange)="
                        setValidationValue(field, 'pattern', $event)
                      "
                      placeholder="Enter regex pattern"
                    />
                    <mat-hint
                      >e.g., ^[a-zA-Z0-9._%+-]+&#64;[a-zA-Z0-9.-]+\\.[a-zA-Z]{{
                        '{'
                      }}2,{{ '}' }}$ for email</mat-hint
                    >
                  </mat-form-field>

                  <mat-form-field appearance="outline" class="full-width">
                    <mat-label>Custom Validation Message</mat-label>
                    <textarea
                      matInput
                      [ngModel]="getValidationMessage(field)"
                      (ngModelChange)="setValidationMessage(field, $event)"
                      placeholder="Enter custom validation message"
                      rows="2"
                    ></textarea>
                  </mat-form-field>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="export-options">
          <h3 class="section-title">Export Options</h3>

          <div class="export-format-options">
            <div class="format-option">
              <mat-checkbox [(ngModel)]="exportJSON" class="format-checkbox">
                <div class="format-info">
                  <strong>JSON Export</strong>
                  <span class="format-description"
                    >Export form definition as JSON file with Formly
                    schema</span
                  >
                </div>
              </mat-checkbox>
            </div>

            <div class="format-option">
              <mat-checkbox
                [(ngModel)]="exportToBackend"
                class="format-checkbox"
              >
                <div class="format-info">
                  <strong>Backend Integration</strong>
                  <span class="format-description"
                    >Send form definition to backend API</span
                  >
                </div>
              </mat-checkbox>
            </div>

            <!-- Backend Integration Options (only show when exportToBackend is checked) -->
            <div *ngIf="exportToBackend" class="backend-options">
              <div class="format-option">
                <mat-radio-group [(ngModel)]="formMode" class="radio-group">
                  <mat-radio-button value="editable" class="radio-option">
                    <div class="format-info">
                      <strong>Editable Form</strong>
                      <span class="format-description"
                        >Users can fill and submit the form (with submit/reset
                        buttons)</span
                      >
                    </div>
                  </mat-radio-button>
                  <mat-radio-button value="readonly" class="radio-option">
                    <div class="format-info">
                      <strong>Read Only Form</strong>
                      <span class="format-description"
                        >Form is read-only (no submit/reset buttons, fields
                        disabled)</span
                      >
                    </div>
                  </mat-radio-button>
                </mat-radio-group>
              </div>
            </div>
          </div>

          <div class="fields-summary">
            <h4 class="summary-title">Form Fields ({{ fields.length }})</h4>
            <div class="fields-list">
              <div *ngFor="let field of fields" class="field-item">
                <mat-icon class="field-icon">{{
                  getFieldIcon(field.type)
                }}</mat-icon>
                <span class="field-label">{{ field.label }}</span>
                <span class="field-type">{{ field.type }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="export-actions">
        <button mat-button (click)="close()" [disabled]="isExporting">
          Cancel
        </button>
        <button
          mat-raised-button
          color="primary"
          (click)="exportForm()"
          [disabled]="!canExport() || isExporting"
        >
          <mat-icon *ngIf="isExporting" class="spinning">sync</mat-icon>
          <span>{{ isExporting ? 'Exporting...' : 'Export Form' }}</span>
        </button>
      </div>
    </div>
  `,
  styles: [
    `
      .export-dialog {
        width: 800px;
        max-width: 90vw;
        max-height: 80vh;
        display: flex;
        flex-direction: column;
        background: white;
        border-radius: 0.5rem;
        overflow: hidden;
      }

      .export-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1.5rem;
        border-bottom: 1px solid #e5e7eb;
        background: #f9fafb;
      }

      .export-title {
        font-size: 1.25rem;
        font-weight: 600;
        color: #1f2937;
        margin: 0;
      }

      .close-btn {
        color: #6b7280;
      }

      .export-content {
        flex: 1;
        padding: 1.5rem;
        overflow-y: auto;
        max-height: calc(80vh - 140px);
      }

      .form-settings {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        margin-bottom: 2rem;
      }

      .full-width {
        width: 100%;
      }

      .validation-section {
        margin-bottom: 2rem;
      }

      .section-title {
        font-size: 1.125rem;
        font-weight: 600;
        color: #1f2937;
        margin: 0 0 1rem 0;
      }

      .fields-list {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
      }

      .field-item {
        border: 1px solid #e5e7eb;
        border-radius: 0.375rem;
        overflow: hidden;
      }

      .field-header {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 1rem;
        background: #f9fafb;
        cursor: pointer;
        transition: background-color 0.2s ease;
      }

      .field-header:hover {
        background: #f3f4f6;
      }

      .field-label {
        flex: 1;
        font-weight: 500;
        color: #374151;
      }

      .expand-icon {
        color: #6b7280;
      }

      .field-validation {
        padding: 1rem;
        border-top: 1px solid #e5e7eb;
        background: white;
      }

      .validation-options {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      .validation-checkbox {
        margin-bottom: 0.5rem;
      }

      .validation-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;
      }

      .export-options {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
      }

      .export-format-options {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      .format-option {
        border: 1px solid #e5e7eb;
        border-radius: 0.375rem;
        padding: 1rem;
      }

      .format-checkbox {
        width: 100%;
      }

      .format-info {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
      }

      .format-description {
        font-size: 0.875rem;
        color: #6b7280;
      }

      .backend-options {
        margin-left: 2rem;
        margin-top: 1rem;
        padding: 1rem;
        background: #f8fafc;
        border-radius: 0.375rem;
        border: 1px solid #e2e8f0;
      }

      .radio-group {
        display: flex;
        flex-direction: column;
        gap: 1rem;
      }

      .radio-option {
        display: flex;
        align-items: flex-start;
        gap: 0.5rem;
      }

      .radio-option ::ng-deep .mat-radio-label {
        white-space: normal;
        align-items: flex-start;
      }

      .fields-summary {
        border: 1px solid #e5e7eb;
        border-radius: 0.375rem;
        padding: 1rem;
      }

      .summary-title {
        font-size: 1rem;
        font-weight: 600;
        color: #1f2937;
        margin: 0 0 1rem 0;
      }

      .field-icon {
        font-size: 1.25rem;
        color: #6b7280;
      }

      .field-type {
        font-size: 0.75rem;
        color: #6b7280;
        text-transform: uppercase;
        background: #e5e7eb;
        padding: 0.25rem 0.5rem;
        border-radius: 0.25rem;
      }

      .export-actions {
        display: flex;
        justify-content: flex-end;
        gap: 1rem;
        padding: 1.5rem;
        border-top: 1px solid #e5e7eb;
        background: #f9fafb;
      }

      /* Responsive Design */
      @media (max-width: 768px) {
        .export-dialog {
          width: 95vw;
          max-height: 90vh;
        }

        .validation-row {
          grid-template-columns: 1fr;
        }

        .export-actions {
          flex-direction: column;
        }

        .export-actions button {
          width: 100%;
        }
      }

      .spinning {
        animation: spin 1s linear infinite;
      }

      @keyframes spin {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(360deg);
        }
      }
    `,
  ],
})
export class FormExportComponent {
  fields: FormField[] = [];

  formName = '';
  exportJSON = true;
  exportToBackend = false;
  formMode = 'editable'; // 'editable' or 'readonly'
  expandedFields = new Set<string>();
  isExporting = false; // Loading state for export

  private formExportService = inject(FormExportService);
  private backendApiService = inject(BackendApiService);
  private dialogRef = inject(MatDialogRef<FormExportComponent>);
  private dialogData = inject(MAT_DIALOG_DATA);
  private snackBar = inject(MatSnackBar);

  constructor() {
    // Get fields from dialog data
    this.fields = this.dialogData.fields || [];

    // Initialize form name from dialog data or default
    this.formName = this.dialogData.formName || 'My Form';
  }

  getFieldIcon(type: string): string {
    const iconMap: { [key: string]: string } = {
      text: 'input',
      email: 'email',
      password: 'lock',
      number: 'pin',
      textarea: 'subject',
      select: 'arrow_drop_down',
      checkbox: 'check_box',
      radio: 'radio_button_checked',
      file: 'attach_file',
      button: 'smart_button',
      tel: 'phone',
      url: 'link',
    };
    return iconMap[type] || 'input';
  }

  toggleFieldValidation(fieldId: string): void {
    if (this.expandedFields.has(fieldId)) {
      this.expandedFields.delete(fieldId);
    } else {
      this.expandedFields.add(fieldId);
    }
  }

  isFieldExpanded(fieldId: string): boolean {
    return this.expandedFields.has(fieldId);
  }

  getValidationValue(field: FormField, type: string): any {
    if (!field.validations) {
      field.validations = [];
    }

    const validation = field.validations.find((v) => v.type === type);
    return validation ? validation.value : null;
  }

  setValidationValue(field: FormField, type: string, value: any): void {
    if (!field.validations) {
      field.validations = [];
    }

    let validation = field.validations.find((v) => v.type === type);
    if (!validation) {
      validation = { type: type as any, value: value, message: '' };
      field.validations.push(validation);
    } else {
      validation.value = value;
    }
  }

  getValidationMessage(field: FormField): string {
    if (!field.validations) {
      field.validations = [];
    }

    const validation = field.validations.find((v) => v.type === 'required');
    return validation ? validation.message : '';
  }

  setValidationMessage(field: FormField, message: string): void {
    if (!field.validations) {
      field.validations = [];
    }

    let validation = field.validations.find((v) => v.type === 'required');
    if (!validation) {
      validation = { type: 'required', value: true, message: message };
      field.validations.push(validation);
    } else {
      validation.message = message;
    }
  }

  canExport(): boolean {
    return (
      this.formName.trim() !== '' && (this.exportJSON || this.exportToBackend)
    );
  }

  exportForm(): void {
    if (!this.canExport()) return;

    this.isExporting = true;

    try {
      // Create FormDefinition object
      const formDefinition: FormDefinition = {
        id: this.generateFormId(),
        name: this.formName,
        fields: this.fields,
        settings: {
          submitButtonText: 'Submit',
          showResetButton: true,
          resetButtonText: 'Reset',
        },
      };

      // Determine if form should be read-only based on formMode
      const isReadOnly = this.formMode === 'readonly';

      // Handle JSON export first (synchronous)
      if (this.exportJSON) {
        const jsonData = this.formExportService.exportToJson(
          formDefinition,
          isReadOnly
        );
        this.downloadFile(
          jsonData,
          `${this.formName.replace(/[^a-zA-Z0-9]/g, '_')}.json`,
          'application/json'
        );
      }

      // Handle backend export (asynchronous)
      if (this.exportToBackend) {
        const backendExport = this.formExportService.exportToBackend(
          formDefinition,
          isReadOnly
        );
        this.backendApiService.exportFormToBackend(backendExport).subscribe({
          next: (response) => {
            console.log('Form exported to backend:', response);
            this.isExporting = false;
            // Close dialog with backend exported flag
            this.dialogRef.close({
              formName: this.formName,
              readOnly: isReadOnly,
              backendExported: true,
              backendExportAttempted: true,
            });
          },
          error: (error) => {
            console.error('Backend export failed:', error);
            this.isExporting = false;
            // Build friendly error message from backend response
            const nameErrors =
              error?.error?.errors?.Name || error?.error?.Errors?.Name;
            const message =
              error?.status === 400 &&
              Array.isArray(nameErrors) &&
              nameErrors.length
                ? nameErrors[0]
                : 'Export failed. Please try again.';
            this.snackBar.open(message, 'Close', { duration: 4000 });
            // Keep dialog open to allow user to change the name and retry
          },
        });
      } else {
        // If only JSON export, close dialog immediately
        this.isExporting = false;
        this.dialogRef.close({
          formName: this.formName,
          readOnly: isReadOnly,
          backendExported: false,
          backendExportAttempted: false,
        });
      }
    } catch (error) {
      console.error('Export failed:', error);
      this.isExporting = false;
      // You could add a toast notification here
    }
  }

  close(): void {
    this.dialogRef.close(null);
  }

  private generateFormId(): string {
    return 'form_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  private downloadFile(
    content: string,
    filename: string,
    contentType: string
  ): void {
    const blob = new Blob([content], { type: contentType });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }

  // Validation support
  @ViewChild('formNameModel') formNameModel?: NgModel;
  formNameError: string | null = null;

  private setFormNameError(message: string): void {
    this.formNameError = message;
    // Mark the input invalid so Angular Material shows the red outline
    const control = this.formNameModel?.control;
    if (control) {
      control.setErrors({ nameExists: true });
      control.markAsTouched();
      control.updateValueAndValidity({ onlySelf: true, emitEvent: false });
    }
  }

  onFormNameChange(): void {
    if (!this.formNameModel) return;
    const control = this.formNameModel.control;
    if (control && control.hasError('nameExists')) {
      // Clear the backend error when user edits the text
      const currentErrors = { ...(control.errors || {}) } as any;
      delete currentErrors.nameExists;
      const hasOtherErrors = Object.keys(currentErrors).length > 0;
      control.setErrors(hasOtherErrors ? currentErrors : null);
    }
    if (this.formNameError) {
      this.formNameError = null;
    }
  }
}
