import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormlyFormRendererComponent } from '../formly-form-renderer/formly-form-renderer.component';
import { FormlyFormSchema } from '../../services/form-export.service';

@Component({
  selector: 'app-form-schema-viewer',
  standalone: true,
  imports: [
    CommonModule,
    MatTabsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    FormlyFormRendererComponent,
  ],
  template: `
    <div class="schema-viewer-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Form Schema Viewer</mat-card-title>
          <mat-card-subtitle>
            View and test your exported form schemas
          </mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
          <mat-tab-group>
            <!-- Form Preview Tab -->
            <mat-tab label="Form Preview">
              <div class="tab-content">
                <div *ngIf="formSchema; else noSchema" class="form-preview">
                  <app-formly-form-renderer
                    [formSchema]="formSchema"
                    (onFormSubmit)="onFormSubmit($event)"
                  ></app-formly-form-renderer>
                </div>
                <ng-template #noSchema>
                  <div class="no-schema">
                    <mat-icon>description</mat-icon>
                    <h3>No Form Schema Available</h3>
                    <p>Please load a form schema to preview it here.</p>
                    <button
                      mat-raised-button
                      color="primary"
                      (click)="loadSampleSchema()"
                    >
                      Load Sample Schema
                    </button>
                  </div>
                </ng-template>
              </div>
            </mat-tab>

            <!-- Schema JSON Tab -->
            <mat-tab label="Schema JSON">
              <div class="tab-content">
                <div class="schema-json">
                  <div class="json-header">
                    <h3>Form Schema JSON</h3>
                    <button
                      mat-icon-button
                      (click)="copyToClipboard()"
                      matTooltip="Copy to clipboard"
                    >
                      <mat-icon>content_copy</mat-icon>
                    </button>
                  </div>
                  <pre *ngIf="formSchema; else noSchemaJson">{{
                    formSchema | json
                  }}</pre>
                  <ng-template #noSchemaJson>
                    <div class="no-schema">
                      <p>No schema to display</p>
                    </div>
                  </ng-template>
                </div>
              </div>
            </mat-tab>

            <!-- Schema Info Tab -->
            <mat-tab label="Schema Info">
              <div class="tab-content">
                <div *ngIf="formSchema; else noSchemaInfo" class="schema-info">
                  <div class="info-section">
                    <h3>Form Definition</h3>
                    <div class="info-grid">
                      <div class="info-item">
                        <strong>Name:</strong>
                        {{ formSchema.formDefinition.name }}
                      </div>
                      <div class="info-item">
                        <strong>Version:</strong>
                        {{ formSchema.formDefinition.version }}
                      </div>
                      <div class="info-item">
                        <strong>Description:</strong>
                        {{
                          formSchema.formDefinition.description ||
                            'No description'
                        }}
                      </div>
                    </div>
                  </div>

                  <div class="info-section">
                    <h3>Metadata</h3>
                    <div class="info-grid">
                      <div class="info-item">
                        <strong>Field Count:</strong>
                        {{ formSchema.metadata.fieldCount }}
                      </div>
                      <div class="info-item">
                        <strong>Exported At:</strong>
                        {{ formSchema.metadata.exportedAt | date : 'medium' }}
                      </div>
                    </div>
                  </div>

                  <div class="info-section">
                    <h3>Field Types</h3>
                    <div class="field-types">
                      <div
                        *ngFor="let type of getFieldTypes()"
                        class="field-type-item"
                      >
                        <span class="field-type-name">{{ type.name }}</span>
                        <span class="field-type-count">{{ type.count }}</span>
                      </div>
                    </div>
                  </div>

                  <div class="info-section">
                    <h3>Settings</h3>
                    <div class="info-grid">
                      <div class="info-item">
                        <strong>Submit Button:</strong>
                        {{ formSchema.settings.submitButtonText }}
                      </div>
                      <div class="info-item">
                        <strong>Reset Button:</strong>
                        {{ formSchema.settings.showResetButton ? 'Yes' : 'No' }}
                      </div>
                      <div class="info-item">
                        <strong>Layout:</strong>
                        {{ formSchema.settings.layout || 'vertical' }}
                      </div>
                    </div>
                  </div>
                </div>
                <ng-template #noSchemaInfo>
                  <div class="no-schema">
                    <p>No schema information to display</p>
                  </div>
                </ng-template>
              </div>
            </mat-tab>
          </mat-tab-group>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [
    `
      .schema-viewer-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 20px;
      }

      .tab-content {
        padding: 20px 0;
        max-height: calc(100vh - 200px);
        overflow-y: auto;
      }

      .form-preview {
        min-height: 400px;
      }

      .schema-json {
        background: #f8f9fa;
        border-radius: 4px;
        padding: 20px;
      }

      .json-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 15px;
      }

      .json-header h3 {
        margin: 0;
        color: #333;
      }

      pre {
        background: #2d3748;
        color: #e2e8f0;
        padding: 15px;
        border-radius: 4px;
        overflow-x: auto;
        font-size: 12px;
        line-height: 1.4;
      }

      .schema-info {
        display: flex;
        flex-direction: column;
        gap: 30px;
      }

      .info-section {
        background: #f8f9fa;
        padding: 20px;
        border-radius: 4px;
      }

      .info-section h3 {
        margin: 0 0 15px 0;
        color: #333;
        border-bottom: 2px solid #007bff;
        padding-bottom: 5px;
      }

      .info-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
        gap: 15px;
      }

      .info-item {
        display: flex;
        flex-direction: column;
        gap: 5px;
      }

      .info-item strong {
        color: #555;
        font-size: 14px;
      }

      .field-types {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 10px;
      }

      .field-type-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: white;
        padding: 10px;
        border-radius: 4px;
        border: 1px solid #dee2e6;
      }

      .field-type-name {
        font-weight: 500;
        color: #333;
        text-transform: capitalize;
      }

      .field-type-count {
        background: #007bff;
        color: white;
        padding: 2px 8px;
        border-radius: 12px;
        font-size: 12px;
        font-weight: bold;
      }

      .no-schema {
        text-align: center;
        padding: 60px 20px;
        color: #666;
      }

      .no-schema mat-icon {
        font-size: 48px;
        width: 48px;
        height: 48px;
        color: #ccc;
        margin-bottom: 20px;
      }

      .no-schema h3 {
        margin: 0 0 10px 0;
        color: #333;
      }

      .no-schema p {
        margin: 0 0 20px 0;
      }

      /* Responsive design */
      @media (max-width: 768px) {
        .schema-viewer-container {
          padding: 10px;
        }

        .tab-content {
          padding: 10px 0;
        }

        .info-grid {
          grid-template-columns: 1fr;
        }

        .field-types {
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
        }
      }
    `,
  ],
})
export class FormSchemaViewerComponent implements OnInit {
  @Input() formSchema?: FormlyFormSchema;

  ngOnInit() {
    // Component initialization
  }

  /**
   * Handle form submission from the rendered form
   */
  onFormSubmit(formData: any) {
    console.log('Form submitted from viewer:', formData);
    // You can handle the form submission here
    // For example, send to backend, show notification, etc.
  }

  /**
   * Copy schema JSON to clipboard
   */
  copyToClipboard() {
    if (this.formSchema) {
      const jsonString = JSON.stringify(this.formSchema, null, 2);
      navigator.clipboard.writeText(jsonString).then(() => {
        console.log('Schema copied to clipboard');
        // You could add a toast notification here
      });
    }
  }

  /**
   * Load a sample schema for testing
   */
  loadSampleSchema() {
    this.formSchema = {
      formDefinition: {
        name: 'Sample Contact Form',
        description: 'A sample contact form for testing',
        version: '1.0',
        fields: [
          {
            key: 'name',
            type: 'input',
            label: 'Full Name',
            placeholder: 'Enter your full name',
            required: true,
            templateOptions: {
              label: 'Full Name',
              placeholder: 'Enter your full name',
              required: true,
            },
            validation: {
              required: true,
            },
          },
          {
            key: 'email',
            type: 'input',
            label: 'Email Address',
            placeholder: 'Enter your email',
            required: true,
            templateOptions: {
              label: 'Email Address',
              placeholder: 'Enter your email',
              required: true,
            },
            validation: {
              required: true,
            },
          },
          {
            key: 'message',
            type: 'textarea',
            label: 'Message',
            placeholder: 'Enter your message',
            required: true,
            templateOptions: {
              label: 'Message',
              placeholder: 'Enter your message',
              required: true,
              rows: 4,
            },
            validation: {
              required: true,
            },
          },
        ],
      },
      metadata: {
        exportedAt: new Date().toISOString(),
        fieldCount: 3,
        fieldTypes: {
          input: 2,
          textarea: 1,
        },
      },
      settings: {
        submitButtonText: 'Send Message',
        showResetButton: true,
        resetButtonText: 'Clear Form',
        layout: 'vertical',
      },
    };
  }

  /**
   * Get field types for display
   */
  getFieldTypes(): Array<{ name: string; count: number }> {
    if (!this.formSchema) return [];

    return Object.entries(this.formSchema.metadata.fieldTypes).map(
      ([name, count]) => ({
        name,
        count,
      })
    );
  }
}
