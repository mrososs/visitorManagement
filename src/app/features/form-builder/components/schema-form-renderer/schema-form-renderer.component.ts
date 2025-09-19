import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormGroup,
  FormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';

interface SchemaProperty {
  type: string;
  title?: string;
  description?: string;
  nullable?: boolean;
  format?: string;
  enum?: any[];
  minLength?: number;
  maxLength?: number;
  minimum?: number;
  maximum?: number;
  pattern?: string;
  items?: {
    type: string;
    enum?: any[];
  };
}

interface FormSchema {
  type: string;
  properties: { [key: string]: SchemaProperty };
  required?: string[];
  readOnly?: boolean;
  layout?: {
    rows: Array<{
      id: string;
      fields: string[];
    }>;
  };
}

interface OpenAPISchema {
  openapi: string;
  info: {
    title: string;
    version: string;
    description?: string;
  };
  paths: any;
  components: {
    schemas: { [key: string]: FormSchema };
  };
}

interface FormField {
  key: string;
  type: string;
  label: string;
  placeholder?: string;
  required: boolean;
  validations: any[];
  options?: any[];
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: string;
  multiple?: boolean;
}

@Component({
  selector: 'app-schema-form-renderer',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatCheckboxModule,
    MatRadioModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
  ],
  template: `
    <div class="schema-form-container">
      <div class="form-header" *ngIf="formTitle">
        <h2>{{ formTitle }}</h2>
        <p *ngIf="formDescription">{{ formDescription }}</p>
        <div *ngIf="isReadOnly" class="readonly-badge">
          <mat-icon>visibility</mat-icon>
          <span>Read Only</span>
        </div>
      </div>

      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="schema-form">
        <!-- Row-based Layout -->
        <div *ngIf="schemaLayout && schemaLayout.rows" class="form-rows">
          <div *ngFor="let row of schemaLayout.rows" class="form-row">
            <div
              *ngFor="let fieldKey of row.fields"
              class="form-field"
              [ngClass]="getFieldClass(getFieldByKey(fieldKey))"
            >
              <ng-container [ngSwitch]="getFieldByKey(fieldKey)?.type">
                <!-- Text Input -->
                <mat-form-field
                  *ngSwitchCase="'text'"
                  appearance="outline"
                  class="full-width"
                >
                  <mat-label>{{ getFieldByKey(fieldKey)?.label }}</mat-label>
                  <input
                    matInput
                    [formControlName]="fieldKey"
                    [placeholder]="getFieldByKey(fieldKey)?.placeholder || ''"
                    [readonly]="isReadOnly"
                    [required]="getFieldByKey(fieldKey)?.required || false"
                  />
                  <mat-error *ngIf="form.get(fieldKey)?.hasError('required')">
                    {{ getFieldByKey(fieldKey)?.label }} is required
                  </mat-error>
                </mat-form-field>

                <!-- Email Input -->
                <mat-form-field
                  *ngSwitchCase="'email'"
                  appearance="outline"
                  class="full-width"
                >
                  <mat-label>{{ getFieldByKey(fieldKey)?.label }}</mat-label>
                  <input
                    matInput
                    type="email"
                    [formControlName]="fieldKey"
                    [placeholder]="getFieldByKey(fieldKey)?.placeholder || ''"
                    [readonly]="isReadOnly"
                    [required]="getFieldByKey(fieldKey)?.required || false"
                  />
                  <mat-error *ngIf="form.get(fieldKey)?.hasError('required')">
                    {{ getFieldByKey(fieldKey)?.label }} is required
                  </mat-error>
                  <mat-error *ngIf="form.get(fieldKey)?.hasError('email')">
                    Please enter a valid email address
                  </mat-error>
                </mat-form-field>

                <!-- Number Input -->
                <mat-form-field
                  *ngSwitchCase="'number'"
                  appearance="outline"
                  class="full-width"
                >
                  <mat-label>{{ getFieldByKey(fieldKey)?.label }}</mat-label>
                  <input
                    matInput
                    type="number"
                    [formControlName]="fieldKey"
                    [placeholder]="getFieldByKey(fieldKey)?.placeholder || ''"
                    [readonly]="isReadOnly"
                    [required]="getFieldByKey(fieldKey)?.required || false"
                    [min]="getFieldByKey(fieldKey)?.min ?? null"
                    [max]="getFieldByKey(fieldKey)?.max ?? null"
                  />
                  <mat-error *ngIf="form.get(fieldKey)?.hasError('required')">
                    {{ getFieldByKey(fieldKey)?.label }} is required
                  </mat-error>
                  <mat-error *ngIf="form.get(fieldKey)?.hasError('min')">
                    {{ getFieldByKey(fieldKey)?.label }} must be at least
                    {{ getFieldByKey(fieldKey)?.min }}
                  </mat-error>
                  <mat-error *ngIf="form.get(fieldKey)?.hasError('max')">
                    {{ getFieldByKey(fieldKey)?.label }} must not exceed
                    {{ getFieldByKey(fieldKey)?.max }}
                  </mat-error>
                </mat-form-field>

                <!-- Select -->
                <mat-form-field
                  *ngSwitchCase="'select'"
                  appearance="outline"
                  class="full-width"
                >
                  <mat-label>{{ getFieldByKey(fieldKey)?.label }}</mat-label>
                  <mat-select
                    [formControlName]="fieldKey"
                    [required]="getFieldByKey(fieldKey)?.required || false"
                    [disabled]="isReadOnly"
                  >
                    <mat-option
                      *ngFor="let option of getFieldByKey(fieldKey)?.options"
                      [value]="option"
                    >
                      {{ option }}
                    </mat-option>
                  </mat-select>
                  <mat-error *ngIf="form.get(fieldKey)?.hasError('required')">
                    {{ getFieldByKey(fieldKey)?.label }} is required
                  </mat-error>
                </mat-form-field>

                <!-- Textarea -->
                <mat-form-field
                  *ngSwitchCase="'textarea'"
                  appearance="outline"
                  class="full-width"
                >
                  <mat-label>{{ getFieldByKey(fieldKey)?.label }}</mat-label>
                  <textarea
                    matInput
                    [formControlName]="fieldKey"
                    [placeholder]="getFieldByKey(fieldKey)?.placeholder || ''"
                    [readonly]="isReadOnly"
                    [required]="getFieldByKey(fieldKey)?.required || false"
                    rows="4"
                  ></textarea>
                  <mat-error *ngIf="form.get(fieldKey)?.hasError('required')">
                    {{ getFieldByKey(fieldKey)?.label }} is required
                  </mat-error>
                </mat-form-field>

                <!-- Checkbox -->
                <div *ngSwitchCase="'checkbox'" class="checkbox-field">
                  <mat-checkbox
                    [formControlName]="fieldKey"
                    [required]="getFieldByKey(fieldKey)?.required || false"
                    [disabled]="isReadOnly"
                  >
                    {{ getFieldByKey(fieldKey)?.label }}
                  </mat-checkbox>
                  <mat-error *ngIf="form.get(fieldKey)?.hasError('required')">
                    {{ getFieldByKey(fieldKey)?.label }} is required
                  </mat-error>
                </div>

                <!-- Radio Buttons -->
                <div *ngSwitchCase="'radio'" class="radio-field">
                  <label class="radio-label">{{
                    getFieldByKey(fieldKey)?.label
                  }}</label>
                  <mat-radio-group
                    [formControlName]="fieldKey"
                    [required]="getFieldByKey(fieldKey)?.required || false"
                    [disabled]="isReadOnly"
                  >
                    <mat-radio-button
                      *ngFor="let option of getFieldByKey(fieldKey)?.options"
                      [value]="option"
                      class="radio-option"
                    >
                      {{ option }}
                    </mat-radio-button>
                  </mat-radio-group>
                  <mat-error *ngIf="form.get(fieldKey)?.hasError('required')">
                    {{ getFieldByKey(fieldKey)?.label }} is required
                  </mat-error>
                </div>

                <!-- Date Picker -->
                <mat-form-field
                  *ngSwitchCase="'date'"
                  appearance="outline"
                  class="full-width"
                >
                  <mat-label>{{ getFieldByKey(fieldKey)?.label }}</mat-label>
                  <input
                    matInput
                    [matDatepicker]="picker"
                    [formControlName]="fieldKey"
                    [placeholder]="getFieldByKey(fieldKey)?.placeholder || ''"
                    [readonly]="isReadOnly"
                    [required]="getFieldByKey(fieldKey)?.required || false"
                  />
                  <mat-datepicker-toggle
                    matSuffix
                    [for]="picker"
                    [disabled]="isReadOnly"
                  ></mat-datepicker-toggle>
                  <mat-datepicker #picker></mat-datepicker>
                  <mat-error *ngIf="form.get(fieldKey)?.hasError('required')">
                    {{ getFieldByKey(fieldKey)?.label }} is required
                  </mat-error>
                </mat-form-field>
              </ng-container>
            </div>
          </div>
        </div>

        <!-- Fallback: Simple grid layout if no row structure -->
        <div *ngIf="!schemaLayout || !schemaLayout.rows" class="form-fields">
          <div
            *ngFor="let field of formFields"
            class="form-field"
            [ngClass]="getFieldClass(field)"
          >
            <!-- Same field templates as above but using field directly -->
            <ng-container [ngSwitch]="field.type">
              <!-- Text Input -->
              <mat-form-field
                *ngSwitchCase="'text'"
                appearance="outline"
                class="full-width"
              >
                <mat-label>{{ field.label }}</mat-label>
                <input
                  matInput
                  [formControlName]="field.key"
                  [placeholder]="field.placeholder || ''"
                  [readonly]="isReadOnly"
                  [required]="field.required || false"
                />
                <mat-error *ngIf="form.get(field.key)?.hasError('required')">
                  {{ field.label }} is required
                </mat-error>
              </mat-form-field>

              <!-- Email Input -->
              <mat-form-field
                *ngSwitchCase="'email'"
                appearance="outline"
                class="full-width"
              >
                <mat-label>{{ field.label }}</mat-label>
                <input
                  matInput
                  type="email"
                  [formControlName]="field.key"
                  [placeholder]="field.placeholder || ''"
                  [readonly]="isReadOnly"
                  [required]="field.required"
                />
                <mat-error *ngIf="form.get(field.key)?.hasError('required')">
                  {{ field.label }} is required
                </mat-error>
                <mat-error *ngIf="form.get(field.key)?.hasError('email')">
                  Please enter a valid email address
                </mat-error>
              </mat-form-field>

              <!-- Number Input -->
              <mat-form-field
                *ngSwitchCase="'number'"
                appearance="outline"
                class="full-width"
              >
                <mat-label>{{ field.label }}</mat-label>
                <input
                  matInput
                  type="number"
                  [formControlName]="field.key"
                  [placeholder]="field.placeholder || ''"
                  [readonly]="isReadOnly"
                  [required]="field.required"
                  [min]="field.min ?? null"
                  [max]="field.max ?? null"
                />
                <mat-error *ngIf="form.get(field.key)?.hasError('required')">
                  {{ field.label }} is required
                </mat-error>
                <mat-error *ngIf="form.get(field.key)?.hasError('min')">
                  {{ field.label }} must be at least {{ field.min }}
                </mat-error>
                <mat-error *ngIf="form.get(field.key)?.hasError('max')">
                  {{ field.label }} must not exceed {{ field.max }}
                </mat-error>
              </mat-form-field>

              <!-- Select -->
              <mat-form-field
                *ngSwitchCase="'select'"
                appearance="outline"
                class="full-width"
              >
                <mat-label>{{ field.label }}</mat-label>
                <mat-select
                  [formControlName]="field.key"
                  [required]="field.required"
                  [disabled]="isReadOnly"
                >
                  <mat-option
                    *ngFor="let option of field.options"
                    [value]="option"
                  >
                    {{ option }}
                  </mat-option>
                </mat-select>
                <mat-error *ngIf="form.get(field.key)?.hasError('required')">
                  {{ field.label }} is required
                </mat-error>
              </mat-form-field>

              <!-- Textarea -->
              <mat-form-field
                *ngSwitchCase="'textarea'"
                appearance="outline"
                class="full-width"
              >
                <mat-label>{{ field.label }}</mat-label>
                <textarea
                  matInput
                  [formControlName]="field.key"
                  [placeholder]="field.placeholder || ''"
                  [readonly]="isReadOnly"
                  [required]="field.required"
                  rows="4"
                ></textarea>
                <mat-error *ngIf="form.get(field.key)?.hasError('required')">
                  {{ field.label }} is required
                </mat-error>
              </mat-form-field>

              <!-- Checkbox -->
              <div *ngSwitchCase="'checkbox'" class="checkbox-field">
                <mat-checkbox
                  [formControlName]="field.key"
                  [required]="field.required"
                  [disabled]="isReadOnly"
                >
                  {{ field.label }}
                </mat-checkbox>
                <mat-error *ngIf="form.get(field.key)?.hasError('required')">
                  {{ field.label }} is required
                </mat-error>
              </div>

              <!-- Radio Buttons -->
              <div *ngSwitchCase="'radio'" class="radio-field">
                <label class="radio-label">{{ field.label }}</label>
                <mat-radio-group
                  [formControlName]="field.key"
                  [required]="field.required"
                  [disabled]="isReadOnly"
                >
                  <mat-radio-button
                    *ngFor="let option of field.options"
                    [value]="option"
                    class="radio-option"
                  >
                    {{ option }}
                  </mat-radio-button>
                </mat-radio-group>
                <mat-error *ngIf="form.get(field.key)?.hasError('required')">
                  {{ field.label }} is required
                </mat-error>
              </div>

              <!-- Date Picker -->
              <mat-form-field
                *ngSwitchCase="'date'"
                appearance="outline"
                class="full-width"
              >
                <mat-label>{{ field.label }}</mat-label>
                <input
                  matInput
                  [matDatepicker]="picker"
                  [formControlName]="field.key"
                  [placeholder]="field.placeholder || ''"
                  [readonly]="isReadOnly"
                  [required]="field.required"
                />
                <mat-datepicker-toggle
                  matSuffix
                  [for]="picker"
                  [disabled]="isReadOnly"
                ></mat-datepicker-toggle>
                <mat-datepicker #picker></mat-datepicker>
                <mat-error *ngIf="form.get(field.key)?.hasError('required')">
                  {{ field.label }} is required
                </mat-error>
              </mat-form-field>
            </ng-container>
          </div>
        </div>

        <!-- Form Actions - Only show if not readOnly and showSubmitButton -->
        <div *ngIf="!isReadOnly && showSubmitButton" class="form-actions">
          <button
            type="submit"
            mat-raised-button
            color="primary"
            [disabled]="!form.valid"
          >
            {{ submitButtonText }}
          </button>

          <button
            type="button"
            mat-button
            (click)="onReset()"
            *ngIf="showResetButton"
          >
            {{ resetButtonText }}
          </button>
        </div>
      </form>

      <!-- Debug Info -->
      <div class="debug-info" *ngIf="showDebug">
        <h4>Form Schema:</h4>
        <pre>{{ schemaJson | json }}</pre>
        <h4>Form Value:</h4>
        <pre>{{ form.value | json }}</pre>
        <h4>Form Valid:</h4>
        <pre>{{ form.valid }}</pre>
        <h4>Read Only:</h4>
        <pre>{{ isReadOnly }}</pre>
      </div>
    </div>
  `,
  styles: [
    `
      .schema-form-container {
        max-width: 800px;
        margin: 0 auto;
        padding: 20px;
        background: white;
        border-radius: 8px;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      }

      .form-header {
        text-align: center;
        margin-bottom: 30px;
        padding-bottom: 20px;
        border-bottom: 1px solid #e0e0e0;
        position: relative;
      }

      .form-header h2 {
        margin: 0 0 10px 0;
        color: #333;
        font-size: 24px;
      }

      .form-header p {
        margin: 0;
        color: #666;
        font-size: 14px;
      }

      .readonly-badge {
        position: absolute;
        top: 0;
        right: 0;
        display: flex;
        align-items: center;
        gap: 4px;
        background: #f0f0f0;
        color: #666;
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 12px;
        font-weight: 500;
      }

      .readonly-badge mat-icon {
        font-size: 16px;
        width: 16px;
        height: 16px;
      }

      .schema-form {
        display: flex;
        flex-direction: column;
        gap: 20px;
      }

      .form-rows {
        display: flex;
        flex-direction: column;
        gap: 20px;
      }

      .form-row {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 16px;
        padding: 16px;
        background: #f8f9fa;
        border-radius: 8px;
        border: 1px solid #e9ecef;
      }

      .form-fields {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 20px;
      }

      .form-field {
        display: flex;
        flex-direction: column;
      }

      .full-width {
        width: 100%;
      }

      .checkbox-field {
        padding: 16px 0;
      }

      .radio-field {
        padding: 16px 0;
      }

      .radio-label {
        display: block;
        margin-bottom: 8px;
        font-weight: 500;
        color: #333;
      }

      .radio-option {
        display: block;
        margin-bottom: 8px;
      }

      .form-actions {
        display: flex;
        gap: 15px;
        justify-content: center;
        margin-top: 30px;
        padding-top: 20px;
        border-top: 1px solid #e0e0e0;
      }

      .debug-info {
        margin-top: 30px;
        padding: 20px;
        background: #f8f9fa;
        border-radius: 4px;
        border: 1px solid #e9ecef;
      }

      .debug-info h4 {
        margin: 0 0 10px 0;
        color: #333;
        font-size: 16px;
      }

      .debug-info pre {
        background: white;
        padding: 10px;
        border-radius: 4px;
        border: 1px solid #dee2e6;
        font-size: 12px;
        overflow-x: auto;
        margin: 0 0 20px 0;
      }

      /* Responsive Design */
      @media (max-width: 768px) {
        .schema-form-container {
          padding: 15px;
          margin: 10px;
        }

        .form-row {
          grid-template-columns: 1fr;
        }

        .form-fields {
          grid-template-columns: 1fr;
        }

        .form-actions {
          flex-direction: column;
        }

        .form-actions button {
          width: 100%;
        }
      }
    `,
  ],
})
export class SchemaFormRendererComponent implements OnInit, OnChanges {
  @Input() schemaJson: string = '';
  @Input() formTitle: string = 'Dynamic Form';
  @Input() formDescription: string = '';
  @Input() submitButtonText: string = 'Submit';
  @Input() showResetButton: boolean = true;
  @Input() resetButtonText: string = 'Reset';
  @Input() showDebug: boolean = false;
  @Input() readonly: boolean = false;
  @Input() initialData: any = null;
  @Input() showSubmitButton: boolean = true;

  @Output() formSubmitted = new EventEmitter<any>();
  @Output() formReset = new EventEmitter<void>();

  form: FormGroup;
  formFields: FormField[] = [];
  schemaLayout: any = null;
  isReadOnly: boolean = false;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({});
  }

  ngOnInit() {
    if (this.schemaJson && this.schemaJson.trim() !== '') {
      this.parseSchema();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (
      changes['schemaJson'] &&
      this.schemaJson &&
      this.schemaJson.trim() !== ''
    ) {
      this.parseSchema();
    }
  }

  private parseSchema() {
    // Check if schemaJson is empty or invalid
    if (!this.schemaJson || this.schemaJson.trim() === '') {
      console.warn('Schema JSON is empty or invalid');
      this.formFields = [];
      this.schemaLayout = null;
      this.isReadOnly = false;
      this.form = this.fb.group({});
      return;
    }

    try {
      const rawSchema = JSON.parse(this.schemaJson);
      let schema: FormSchema;

      // Check if this is an OpenAPI 3.0 specification
      if (
        rawSchema.openapi &&
        rawSchema.components &&
        rawSchema.components.schemas
      ) {
        console.log(
          'Detected OpenAPI 3.0 specification, extracting form schema...'
        );

        const openApiSchema = rawSchema as OpenAPISchema;
        const schemaKeys = Object.keys(openApiSchema.components.schemas);

        if (schemaKeys.length === 0) {
          console.error('No schemas found in OpenAPI components');
          this.formFields = [];
          this.schemaLayout = null;
          this.isReadOnly = false;
          this.form = this.fb.group({});
          return;
        }

        // Get the first schema (assuming it's the form schema)
        const firstSchemaKey = schemaKeys[0];
        schema = openApiSchema.components.schemas[firstSchemaKey];

        console.log(`Extracted schema "${firstSchemaKey}":`, schema);

        // Update form title if available from OpenAPI info
        if (openApiSchema.info && openApiSchema.info.title && !this.formTitle) {
          this.formTitle = openApiSchema.info.title;
        }
        if (
          openApiSchema.info &&
          openApiSchema.info.description &&
          !this.formDescription
        ) {
          this.formDescription = openApiSchema.info.description;
        }
      } else {
        // Direct form schema
        schema = rawSchema as FormSchema;
      }

      // Validate schema structure
      if (!schema || !schema.properties) {
        console.error('Invalid schema: missing properties', schema);
        this.formFields = [];
        this.schemaLayout = null;
        this.isReadOnly = false;
        this.form = this.fb.group({});
        return;
      }

      this.formFields = this.convertSchemaToFields(schema);
      this.schemaLayout = schema.layout || null;
      this.isReadOnly = schema.readOnly || this.readonly || false;
      this.buildForm();

      // Set initial data if provided
      if (this.initialData) {
        this.form.patchValue(this.initialData);
      }
    } catch (error) {
      console.error('Error parsing schema:', error);
      this.formFields = [];
      this.schemaLayout = null;
      this.isReadOnly = false;
      this.form = this.fb.group({});
    }
  }

  private convertSchemaToFields(schema: FormSchema): FormField[] {
    const fields: FormField[] = [];

    // Ensure schema.properties exists
    if (!schema.properties || typeof schema.properties !== 'object') {
      console.error('Schema properties is missing or invalid:', schema);
      return fields;
    }

    console.log('Converting schema properties to fields:', schema.properties);

    for (const [key, property] of Object.entries(schema.properties)) {
      // Validate property structure
      if (!property || typeof property !== 'object') {
        console.warn(`Invalid property for key ${key}, skipping:`, property);
        continue;
      }

      try {
        const field: FormField = {
          key: key,
          type: this.getFieldType(property),
          label: property.title || key,
          placeholder: property.description || '',
          required:
            schema.required && Array.isArray(schema.required)
              ? schema.required.includes(key)
              : !property.nullable, // Use nullable if available, otherwise default to false
          validations: this.getValidations(property),
          options: property.enum || property.items?.enum,
          min: property.minimum,
          max: property.maximum,
          minLength: property.minLength,
          maxLength: property.maxLength,
          pattern: property.pattern,
          multiple: property.type === 'array',
        };

        console.log(`Created field for key ${key}:`, field);
        fields.push(field);
      } catch (error) {
        console.error(`Error creating field for key ${key}:`, error, property);
        continue;
      }
    }

    console.log(`Converted ${fields.length} fields from schema`);
    return fields;
  }

  private getFieldType(property: SchemaProperty): string {
    console.log('Determining field type for property:', property);

    if (property.format === 'email') {
      console.log('Field type: email');
      return 'email';
    }
    if (property.format === 'date') {
      console.log('Field type: date');
      return 'date';
    }
    if (property.format === 'uri') {
      console.log('Field type: url');
      return 'url';
    }
    if (property.type === 'array') {
      console.log('Field type: select (array)');
      return 'select';
    }
    if (property.type === 'boolean') {
      console.log('Field type: checkbox (boolean)');
      return 'checkbox';
    }
    if (property.enum && property.enum.length <= 3) {
      console.log('Field type: radio (enum <= 3)');
      return 'radio';
    }
    if (property.enum && property.enum.length > 3) {
      console.log('Field type: select (enum > 3)');
      return 'select';
    }
    if (property.type === 'number' || property.type === 'integer') {
      console.log('Field type: number');
      return 'number';
    }

    console.log('Field type: text (default)');
    return 'text';
  }

  private getValidations(property: SchemaProperty): any[] {
    const validations: any[] = [];

    if (property.minLength !== undefined) {
      validations.push({ type: 'minLength', value: property.minLength });
    }

    if (property.maxLength !== undefined) {
      validations.push({ type: 'maxLength', value: property.maxLength });
    }

    if (property.minimum !== undefined) {
      validations.push({ type: 'min', value: property.minimum });
    }

    if (property.maximum !== undefined) {
      validations.push({ type: 'max', value: property.maximum });
    }

    if (property.pattern) {
      validations.push({ type: 'pattern', value: property.pattern });
    }

    return validations;
  }

  private buildForm() {
    const group: any = {};

    if (this.formFields.length === 0) {
      console.warn('No form fields available, creating empty form');
      this.form = this.fb.group({});
      return;
    }

    this.formFields.forEach((field) => {
      try {
        const validators = this.getFormValidators(field);
        const defaultValue = this.getDefaultValue(field);
        group[field.key] = [defaultValue, validators];
        console.log(
          `Added form control for ${field.key} with default value:`,
          defaultValue
        );
      } catch (error) {
        console.error(
          `Error building form control for field ${field.key}:`,
          error
        );
        // Add a basic control as fallback
        group[field.key] = ['', []];
      }
    });

    this.form = this.fb.group(group);
    console.log('Form built successfully with controls:', Object.keys(group));
  }

  private getDefaultValue(field: FormField): any {
    switch (field.type) {
      case 'checkbox':
        return false;
      case 'number':
        return field.min !== undefined ? field.min : null;
      case 'select':
      case 'radio':
        return field.required && field.options && field.options.length > 0
          ? null
          : null;
      default:
        return field.required ? '' : null;
    }
  }

  private getFormValidators(field: FormField): any[] {
    const validators: any[] = [];

    if (field.required) {
      validators.push(Validators.required);
    }

    if (field.minLength !== undefined) {
      validators.push(Validators.minLength(field.minLength));
    }

    if (field.maxLength !== undefined) {
      validators.push(Validators.maxLength(field.maxLength));
    }

    if (field.min !== undefined) {
      validators.push(Validators.min(field.min));
    }

    if (field.max !== undefined) {
      validators.push(Validators.max(field.max));
    }

    if (field.pattern) {
      validators.push(Validators.pattern(field.pattern));
    }

    if (field.type === 'email') {
      validators.push(Validators.email);
    }

    return validators;
  }

  getFieldByKey(key: string): FormField | undefined {
    return this.formFields.find((field) => field.key === key);
  }

  getFieldClass(field: FormField | undefined): string {
    if (!field) return '';
    return `field-${field.type}`;
  }

  onSubmit() {
    if (this.form.valid && !this.isReadOnly) {
      this.formSubmitted.emit(this.form.value);
    }
  }

  onReset() {
    if (!this.isReadOnly) {
      this.form.reset();
      this.formReset.emit();
    }
  }
}
