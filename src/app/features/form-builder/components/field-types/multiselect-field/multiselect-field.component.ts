import {
  Component,
  input,
  inject,
  signal,
  computed,
  effect,
} from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { FormField } from '../../../models/field';
import { CommonModule } from '@angular/common';
import {
  DynamicOptionsService,
  OptionItem,
} from '../../../services/dynamic-options.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-multiselect-field',
  imports: [
    MatFormFieldModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatIconModule,
    CommonModule,
    FormsModule,
  ],
  template: `
    <mat-form-field appearance="outline" class="w-full">
      <mat-label>
        {{ field().label }}
        @if (field().required) {
        <span class="required-indicator">*</span>
        }
      </mat-label>
      <mat-select
        [required]="field().required"
        [placeholder]="field().placeholder || 'Choose options'"
        [disabled]="isLoading()"
        multiple
      >
        @if (isLoading()) {
        <mat-option disabled>
          <div class="loading-option">
            <mat-spinner diameter="16"></mat-spinner>
            <span>Loading options...</span>
          </div>
        </mat-option>
        } @else if (hasError()) {
        <mat-option disabled>
          <div class="error-option">
            <mat-icon>error</mat-icon>
            <span>{{ errorMessage() }}</span>
          </div>
        </mat-option>
        } @else if (currentOptions().length === 0) {
        <mat-option disabled>
          <div class="no-options">
            <mat-icon>info</mat-icon>
            <span>No options available</span>
          </div>
        </mat-option>
        } @else { @for (option of currentOptions(); track option.value) {
        <mat-option [value]="option.value">
          {{ option.label }}
        </mat-option>
        } }
      </mat-select>
      @if (field().optionSource === 'external' && field().apiConfig?.url) {
      <mat-hint align="start"
        >Loading from: {{ field().apiConfig?.url }}</mat-hint
      >
      } @if (field().optionSource === 'static' && field().staticOptions) {
      <mat-hint align="start">Static options loaded</mat-hint>
      } @if (field().maxSelections) {
      <mat-hint align="end"
        >Max selections: {{ field().maxSelections }}</mat-hint
      >
      }
    </mat-form-field>
  `,
  styles: `
    .required-indicator {
      color: #f44336;
      margin-left: 4px;
    }
    
    .loading-option,
    .error-option,
    .no-options {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px;
    }
    
    .loading-option {
      color: #1976d2;
    }
    
    .error-option {
      color: #f44336;
    }
    
    .no-options {
      color: #ff9800;
    }
  `,
})
export class MultiselectFieldComponent {
  field = input.required<FormField>();

  private dynamicOptionsService = inject(DynamicOptionsService);

  // Signals for managing options and state
  private options = signal<OptionItem[]>([]);
  isLoading = signal(false);
  hasError = signal(false);
  errorMessage = signal('');

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
}
