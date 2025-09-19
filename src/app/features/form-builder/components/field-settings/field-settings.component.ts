import { Component, computed, inject } from '@angular/core';
import { FormService } from '../../services/form.service';
import { FieldTypesService } from '../../services/field-types.service';
import { MatFormField } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatSelect } from '@angular/material/select';
import { MatCheckbox } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { MatLabel, MatHint } from '@angular/material/form-field';
import { MatOption } from '@angular/material/select';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-field-settings',
  imports: [
    MatFormField,
    MatInput,
    MatSelect,
    MatCheckbox,
    FormsModule,
    MatLabel,
    MatHint,
    MatOption,
    MatIcon,
    CommonModule,
  ],

  template: `
    <div class="field-settings-container">
      @if(formService.selectField(); as selectField){
      <div
        class="sticky top-0 z-10 bg-white p-5 border-b rounded-t-xl flex items-center justify-between shadow-sm"
      >
        <h3 class="text-lg font-semibold text-gray-800">Field Properties</h3>
        <button
          mat-icon-button
          aria-label="Close dialog"
          (click)="onClose()"
          class="text-gray-600 hover:text-gray-800"
        >
          <mat-icon>close</mat-icon>
        </button>
      </div>
      <div
        class="field-settings-content p-6 pt-4 max-h-[70vh] overflow-y-auto space-y-5"
      >
        @for (setting of fieldSettings(); track setting.key) { @if
        (shouldShowSetting(setting, selectField)) { @switch (setting.type) {
        @case('text'){
        <mat-form-field appearance="outline" class="w-full">
          <mat-label>{{ setting.label }}</mat-label>
          <input
            matInput
            [ngModel]="getNestedValue(selectField, setting.key)"
            (ngModelChange)="
              updateNestedField(selectField.id, setting.key, $event)
            "
            [placeholder]="getPlaceholder(setting.key)"
          />
        </mat-form-field>
        } @case('number'){
        <mat-form-field appearance="outline" class="w-full">
          <mat-label>{{ setting.label }}</mat-label>
          <input
            matInput
            type="number"
            [ngModel]="getNestedValue(selectField, setting.key)"
            (ngModelChange)="
              updateNestedField(selectField.id, setting.key, $event)
            "
          />
        </mat-form-field>
        } @case('checkbox'){
        <div class="flex items-center">
          <mat-checkbox
            [checked]="getNestedValue(selectField, setting.key)"
            (change)="
              updateNestedField(selectField.id, setting.key, $event.checked)
            "
            class="mr-2"
          >
          </mat-checkbox>
          <span>{{ setting.label }}</span>
        </div>
        } @case('select'){
        <mat-form-field appearance="outline" class="w-full">
          <mat-label>{{ setting.label }}</mat-label>
          <mat-select
            [ngModel]="getNestedValue(selectField, setting.key)"
            (ngModelChange)="
              updateNestedField(selectField.id, setting.key, $event)
            "
          >
            @for (option of setting.options; track option.value) {
            <mat-option [value]="option.value">{{ option.label }}</mat-option>
            }
          </mat-select>
        </mat-form-field>
        } } } }

        <!-- Validation Settings Section -->
        <div class="validation-section mt-2">
          <div class="flex items-center justify-between mb-3">
            <h4 class="text-lg font-semibold text-gray-800">
              Validation Rules
            </h4>
            <button
              mat-icon-button
              (click)="toggleValidationExpanded()"
              class="text-gray-600 hover:text-gray-800"
            >
              <mat-icon>{{
                validationExpanded ? 'expand_less' : 'expand_more'
              }}</mat-icon>
            </button>
          </div>

          @if (validationExpanded) {
          <div class="validation-content space-y-4">
            <!-- Required Field -->
            <div class="flex items-center">
              <mat-checkbox
                [checked]="selectField.required"
                (change)="
                  updateField(selectField.id, 'required', $event.checked)
                "
                class="mr-2"
              >
              </mat-checkbox>
              <span class="text-sm font-medium text-gray-700"
                >Required Field</span
              >
            </div>

            <!-- Min/Max Length for text fields -->
            @if (selectField.type === 'text' || selectField.type === 'textarea'
            || selectField.type === 'email' || selectField.type === 'password')
            {
            <div class="grid grid-cols-2 gap-4">
              <mat-form-field appearance="outline" class="w-full">
                <mat-label>Min Length</mat-label>
                <input
                  matInput
                  type="number"
                  [ngModel]="getValidationValue(selectField, 'minLength')"
                  (ngModelChange)="
                    setValidationValue(selectField.id, 'minLength', $event)
                  "
                  min="0"
                />
              </mat-form-field>
              <mat-form-field appearance="outline" class="w-full">
                <mat-label>Max Length</mat-label>
                <input
                  matInput
                  type="number"
                  [ngModel]="getValidationValue(selectField, 'maxLength')"
                  (ngModelChange)="
                    setValidationValue(selectField.id, 'maxLength', $event)
                  "
                  min="0"
                />
              </mat-form-field>
            </div>
            }

            <!-- Min/Max Value for number fields -->
            @if (selectField.type === 'number') {
            <div class="grid grid-cols-2 gap-4">
              <mat-form-field appearance="outline" class="w-full">
                <mat-label>Min Value</mat-label>
                <input
                  matInput
                  type="number"
                  [ngModel]="getValidationValue(selectField, 'min')"
                  (ngModelChange)="
                    setValidationValue(selectField.id, 'min', $event)
                  "
                />
              </mat-form-field>
              <mat-form-field appearance="outline" class="w-full">
                <mat-label>Max Value</mat-label>
                <input
                  matInput
                  type="number"
                  [ngModel]="getValidationValue(selectField, 'max')"
                  (ngModelChange)="
                    setValidationValue(selectField.id, 'max', $event)
                  "
                />
              </mat-form-field>
            </div>
            }

            <!-- Pattern validation for text and email fields -->
            @if (selectField.type === 'text' || selectField.type === 'email') {
            <mat-form-field appearance="outline" class="w-full">
              <mat-label>Pattern (Regex)</mat-label>
              <input
                matInput
                [ngModel]="getValidationValue(selectField, 'pattern')"
                (ngModelChange)="
                  setValidationValue(selectField.id, 'pattern', $event)
                "
                placeholder="Enter regex pattern"
              />
              <mat-hint
                >e.g., ^[a-zA-Z0-9._%+-]+&#64;[a-zA-Z0-9.-]+\\.[a-zA-Z]{{
                  '{'
                }}2,{{ '}' }}$ for email</mat-hint
              >
            </mat-form-field>
            }

            <!-- Custom validation message -->
            <mat-form-field appearance="outline" class="w-full">
              <mat-label>Custom Validation Message</mat-label>
              <textarea
                matInput
                [ngModel]="getValidationMessage(selectField)"
                (ngModelChange)="setValidationMessage(selectField.id, $event)"
                placeholder="Enter custom validation message"
                rows="2"
              ></textarea>
            </mat-form-field>
          </div>
          }
        </div>
      </div>
      <div
        class="sticky bottom-0 z-10 bg-white/90 backdrop-blur p-4 border-t rounded-b-xl flex items-center justify-end gap-3"
        role="toolbar"
        aria-label="Dialog actions"
      >
        <button
          mat-stroked-button
          (click)="onClose()"
          class="!h-10 !px-4 !rounded-lg !border-gray-300 !text-gray-700 hover:!bg-gray-100 flex items-center gap-2"
          aria-label="Cancel and close"
        >
          <mat-icon class="!text-gray-600">close</mat-icon>
          <span>Cancel</span>
        </button>
        <button
          mat-flat-button
          color="primary"
          (click)="onSave()"
          class="!h-10 !px-4 !rounded-lg !text-white !bg-indigo-600 hover:!bg-indigo-700 shadow-md hover:shadow-lg flex items-center gap-2"
          aria-label="Save changes"
        >
          <mat-icon>save</mat-icon>
          <span>Save</span>
        </button>
      </div>
      }
    </div>
  `,
  styles: `
    .validation-section {
      border-top: 1px solid #e5e7eb;
      padding-top: 1rem;
    }

    .validation-content {
      background: #f9fafb;
      padding: 1rem;
      border-radius: 0.375rem;
      border: 1px solid #e5e7eb;
    }

    @media (max-width: 768px) {
      .grid-cols-2 {
        grid-template-columns: 1fr;
      }
    }
  `,
})
export class FieldSettingsComponent {
  formService = inject(FormService);
  fieldTypesService = inject(FieldTypesService);
  private dialogRef = inject(MatDialogRef<FieldSettingsComponent>, {
    optional: true,
  });

  validationExpanded = false;

  fieldSettings = computed(() => {
    const field = this.formService.selectField();
    if (!field) {
      return [];
    }
    const fieldDef = this.fieldTypesService.getFieldType(field.type);
    return fieldDef?.settingsConfig ?? [];
  });

  findValues = computed(() => {
    const field = this.formService.selectField();
    if (!field) {
      return {};
    }
    return field as any;
  });

  updateField(fieldId: string, key: string, value: any) {
    this.formService.updateField(fieldId, key, value);
  }

  updateNestedField(fieldId: string, key: string, value: any) {
    if (key.includes('.')) {
      // Handle nested properties like apiConfig.url
      const keys = key.split('.');
      const field = this.formService.selectField();
      if (!field) return;

      let current = field as any;
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) {
          current[keys[i]] = {};
        }
        current = current[keys[i]];
      }
      current[keys[keys.length - 1]] = value;

      // Update the entire field to trigger change detection
      this.formService.updateField(
        fieldId,
        keys[0],
        field[keys[0] as keyof typeof field]
      );
    } else {
      this.updateField(fieldId, key, value);
    }
  }

  getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
  }

  toggleValidationExpanded() {
    this.validationExpanded = !this.validationExpanded;
  }

  onClose() {
    this.dialogRef?.close(false);
  }

  onSave() {
    // Settings are already bound live to the selected field.
    // The save action simply confirms and closes the dialog.
    this.dialogRef?.close(true);
  }

  getValidationValue(field: any, type: string): any {
    if (!field.validations) {
      field.validations = [];
    }

    const validation = field.validations.find((v: any) => v.type === type);
    return validation ? validation.value : null;
  }

  setValidationValue(fieldId: string, type: string, value: any): void {
    const field = this.formService.selectField();
    if (!field) return;

    if (!field.validations) {
      field.validations = [];
    }

    let validation = field.validations.find((v: any) => v.type === type);
    if (!validation) {
      validation = { type: type as any, value: value, message: '' };
      field.validations.push(validation);
    } else {
      validation.value = value;
    }

    // Update the field in the service
    this.formService.updateField(fieldId, 'validations', field.validations);
  }

  getValidationMessage(field: any): string {
    if (!field.validations) {
      field.validations = [];
    }

    const validation = field.validations.find(
      (v: any) => v.type === 'required'
    );
    return validation ? validation.message : '';
  }

  setValidationMessage(fieldId: string, message: string): void {
    const field = this.formService.selectField();
    if (!field) return;

    if (!field.validations) {
      field.validations = [];
    }

    let validation = field.validations.find((v: any) => v.type === 'required');
    if (!validation) {
      validation = { type: 'required', value: true, message: message };
      field.validations.push(validation);
    } else {
      validation.message = message;
    }

    // Update the field in the service
    this.formService.updateField(fieldId, 'validations', field.validations);
  }

  shouldShowSetting(setting: any, field: any): boolean {
    const optionSource = field.optionSource || 'static';

    // Show Static Options setting only when optionSource is 'static'
    if (setting.key === 'staticOptions') {
      return optionSource === 'static';
    }

    // Show External API settings only when optionSource is 'external'
    if (setting.key.startsWith('apiConfig.')) {
      return optionSource === 'external';
    }

    // Show multi-select settings only for relevant field types
    if (setting.key === 'allowMultiple') {
      return field.type === 'radio';
    }

    if (setting.key === 'maxSelections') {
      return (
        field.type === 'multiselect' ||
        (field.type === 'radio' && field.allowMultiple)
      );
    }

    if (setting.key === 'minSelections') {
      return field.type === 'radio' && field.allowMultiple;
    }

    // Show all other settings
    return true;
  }

  getPlaceholder(key: string): string {
    switch (key) {
      case 'staticOptions':
        return 'Option 1, Option 2, Option 3';
      case 'apiConfig.url':
        return 'https://api.example.com/data';
      case 'apiConfig.dataPath':
        return 'data.items or leave empty for root array';
      case 'apiConfig.valueField':
        return 'id or value';
      case 'apiConfig.labelField':
        return 'name or label';
      default:
        return '';
    }
  }
}
