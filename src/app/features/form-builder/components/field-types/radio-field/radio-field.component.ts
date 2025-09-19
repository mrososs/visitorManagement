import {
  Component,
  input,
  inject,
  signal,
  computed,
  effect,
} from '@angular/core';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { FormField } from '../../../models/field';
import { CommonModule } from '@angular/common';
import {
  DynamicOptionsService,
  OptionItem,
} from '../../../services/dynamic-options.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-radio-field',
  imports: [
    MatRadioModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatChipsModule,
    CommonModule,
    FormsModule,
  ],
  template: `
    <div class="radio-field-container">
      <label class="radio-label">
        {{ field().label }}
        @if (field().required) {
        <span class="required-indicator">*</span>
        }
      </label>

      @if (isLoading()) {
      <div class="loading-container">
        <mat-spinner diameter="20"></mat-spinner>
        <span>Loading options...</span>
      </div>
      } @else if (hasError()) {
      <div class="error-container">
        <mat-icon>error</mat-icon>
        <span>{{ errorMessage() }}</span>
      </div>
      } @else if (currentOptions().length === 0) {
      <div class="no-options-container">
        <mat-icon>info</mat-icon>
        <span>No options available</span>
      </div>
      } @else { @if (field().allowMultiple) {
      <!-- Multi-select mode using checkboxes -->
      <div class="checkbox-group">
        @for (option of currentOptions(); track option.value) {
        <mat-checkbox
          [value]="option.value"
          [checked]="isOptionSelected(option.value)"
          (change)="onCheckboxChange(option.value, $event.checked)"
          class="checkbox-option"
        >
          {{ option.label }}
        </mat-checkbox>
        }
      </div>

      @if (selectedValues().length > 0) {
      <div class="selected-values">
        <label>Selected:</label>
        <mat-chip-set>
          @for (value of selectedValues(); track value) {
          <mat-chip
            [value]="value"
            (removed)="removeSelection(value)"
            removable
          >
            {{ getOptionLabel(value) }}
            <mat-icon matChipRemove>cancel</mat-icon>
          </mat-chip>
          }
        </mat-chip-set>
      </div>
      } @if (field().maxSelections && selectedValues().length >=
      field().maxSelections!) {
      <div class="max-selections-warning">
        <mat-icon>warning</mat-icon>
        <span>Maximum {{ field().maxSelections }} selections allowed</span>
      </div>
      } } @else {
      <!-- Single-select mode using radio buttons -->
      <mat-radio-group [required]="field().required" class="radio-group">
        @for (option of currentOptions(); track option.value) {
        <mat-radio-button [value]="option.value" class="radio-option">
          {{ option.label }}
        </mat-radio-button>
        }
      </mat-radio-group>
      } } @if (field().optionSource === 'external' && field().apiConfig?.url) {
      <div class="api-info">
        <mat-icon>link</mat-icon>
        <span>Loading from: {{ field().apiConfig?.url }}</span>
      </div>
      } @if (field().optionSource === 'static' && field().staticOptions) {
      <div class="api-info">
        <mat-icon>data_array</mat-icon>
        <span>Static options loaded</span>
      </div>
      }
    </div>
  `,
  styles: `
    .radio-field-container {
      padding: 16px;
      border: 1px solid #e0e0e0;
      border-radius: 4px;
      background-color: #fafafa;
    }
    
    .radio-label {
      display: block;
      margin-bottom: 12px;
      font-weight: 500;
      color: rgba(0, 0, 0, 0.87);
    }
    
    .required-indicator {
      color: #f44336;
      margin-left: 4px;
    }
    
    .radio-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    
    .radio-option {
      display: block;
      margin-bottom: 8px;
    }
    
    .checkbox-group {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    
    .checkbox-option {
      display: block;
      margin-bottom: 8px;
    }
    
    .loading-container,
    .error-container,
    .no-options-container {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px;
      border-radius: 4px;
    }
    
    .loading-container {
      background-color: #e3f2fd;
      color: #1976d2;
    }
    
    .error-container {
      background-color: #ffebee;
      color: #f44336;
    }
    
    .no-options-container {
      background-color: #fff3e0;
      color: #ff9800;
    }
    
    .selected-values {
      margin-top: 12px;
      padding: 8px;
      background-color: #f5f5f5;
      border-radius: 4px;
    }
    
    .selected-values label {
      display: block;
      margin-bottom: 8px;
      font-weight: 500;
      color: rgba(0, 0, 0, 0.87);
    }
    
    .max-selections-warning {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-top: 8px;
      padding: 8px;
      background-color: #fff3e0;
      color: #ff9800;
      border-radius: 4px;
    }
    
    .api-info {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-top: 8px;
      font-size: 12px;
      color: #666;
    }
    
    mat-chip-set {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
    }
  `,
})
export class RadioFieldComponent {
  field = input.required<FormField>();

  private dynamicOptionsService = inject(DynamicOptionsService);

  // Signals for managing options and state
  private options = signal<OptionItem[]>([]);
  isLoading = signal(false);
  hasError = signal(false);
  errorMessage = signal('');
  selectedValues = signal<string[]>([]);

  // Computed value for current options
  currentOptions = computed(() => this.options());

  constructor() {
    // Effect to reload options when field changes
    effect(() => {
      const field = this.field();
      this.loadOptions();
    });
  }

  private loadOptions() {
    const field = this.field();
    const optionSource = field.optionSource || 'static';

    this.isLoading.set(true);
    this.hasError.set(false);
    this.errorMessage.set('');

    this.dynamicOptionsService
      .getOptions(optionSource, field.staticOptions, field.apiConfig)
      .subscribe({
        next: (options) => {
          this.options.set(options);
          this.isLoading.set(false);
        },
        error: (error) => {
          console.error('Error loading options:', error);
          this.hasError.set(true);
          this.errorMessage.set(error.message || 'Failed to load options');
          this.isLoading.set(false);
        },
      });
  }

  isOptionSelected(value: string): boolean {
    return this.selectedValues().includes(value);
  }

  onCheckboxChange(value: string, checked: boolean) {
    const currentValues = this.selectedValues();
    const maxSelections = this.field().maxSelections;

    if (checked) {
      if (!maxSelections || currentValues.length < maxSelections) {
        this.selectedValues.set([...currentValues, value]);
      }
    } else {
      this.selectedValues.set(currentValues.filter((v) => v !== value));
    }
  }

  removeSelection(value: string) {
    const currentValues = this.selectedValues();
    this.selectedValues.set(currentValues.filter((v) => v !== value));
  }

  getOptionLabel(value: string): string {
    const option = this.options().find((opt) => opt.value === value);
    return option ? option.label : value;
  }
}
