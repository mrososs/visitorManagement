import { Component, OnInit, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import {
  BackendApiService,
  FormSchemaItem,
  FormSubmission,
} from '../../services/backend-api.service';
import { SchemaFormRendererComponent } from '../schema-form-renderer/schema-form-renderer.component';
import { ConfirmDeleteDialogComponent } from '../confirm-delete-dialog/confirm-delete-dialog.component';
import { Router } from '@angular/router';

interface ParsedFormSchema {
  id: number;
  name: string;
  schemaJson: string;
  createdAt: string;
  parsedSchema?: any;
  fieldCount: number;
  formType: 'legacy' | 'openapi' | 'unknown';
  hasFields: boolean;
}

interface FormSubmissionData {
  id: number;
  dataJson: string;
  submittedAt: string;
  formDefinitionId: number;
  parsedData: any;
  fieldValues: { [key: string]: any };
}

@Component({
  selector: 'app-form-schemas-list',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatDividerModule,
    MatChipsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatDialogModule,
    SchemaFormRendererComponent,
  ],
  template: `
    <div class="form-schemas-container">
      <div class="header">
        <div class="header-content">
          <h2>Form Schemas</h2>
          <p>Browse and preview all saved form schemas</p>
        </div>
        <div class="header-actions">
          <button
            mat-raised-button
            color="primary"
            (click)="refreshSchemas()"
            [disabled]="loading"
          >
            <mat-icon>refresh</mat-icon>
            Refresh
          </button>
        </div>
      </div>

      @if (loading) {
      <div class="loading-container">
        <mat-spinner diameter="50"></mat-spinner>
        <p>Loading form schemas...</p>
      </div>
      } @else if (formSchemas.length === 0) {
      <div class="empty-state">
        <mat-icon class="empty-icon">description</mat-icon>
        <h3>No Form Schemas Found</h3>
        <p>
          No form schemas available. Create your first form schema to get
          started.
        </p>
      </div>
      } @else {
      <div class="schemas-grid">
        @for (schema of formSchemas; track schema.id) {
        <mat-card
          class="schema-card"
          [class.selected]="selectedSchema?.id === schema.id"
        >
          <mat-card-header>
            <div class="card-header-content">
              <mat-card-title>{{ schema.name }}</mat-card-title>
              <mat-card-subtitle>
                Created: {{ formatDate(schema.createdAt) }}
              </mat-card-subtitle>
            </div>
            <div class="card-actions">
              <button
                mat-icon-button
                matTooltip="Preview Schema"
                (click)="previewSchema(schema)"
                [disabled]="!schema.hasFields"
              >
                <mat-icon>visibility</mat-icon>
              </button>
              <button
                mat-icon-button
                matTooltip="View Submissions"
                (click)="viewSubmissions(schema)"
              >
                <mat-icon>table_chart</mat-icon>
              </button>
              <button
                mat-icon-button
                matTooltip="Load in Form Builder"
                (click)="loadInFormBuilder(schema)"
              >
                <mat-icon>edit</mat-icon>
              </button>
              <button
                mat-icon-button
                matTooltip="Delete Schema"
                (click)="deleteSchema(schema)"
                class="delete-button"
              >
                <mat-icon>delete</mat-icon>
              </button>
            </div>
          </mat-card-header>

          <mat-card-content>
            <div class="schema-info">
              <div class="info-chips">
                <mat-chip-set>
                 
                  @if (schema.hasFields) {
                  <mat-chip>
                    {{ schema.fieldCount }}
                    {{ schema.fieldCount === 1 ? 'Field' : 'Fields' }}
                  </mat-chip>
                  } @else {
                  <mat-chip class="warning-chip"> No Fields </mat-chip>
                  }
                </mat-chip-set>
              </div>

              @if (schema.parsedSchema && schema.hasFields) {
              <div class="schema-preview">
                <p class="preview-title">Fields Preview:</p>
                <div class="fields-preview">
                  @for (field of getSchemaFields(schema); track field.key) {
                  <div class="field-item">
                    <mat-icon class="field-icon">{{
                      getFieldIcon(field.type)
                    }}</mat-icon>
                    <span class="field-label">{{ field.label }}</span>
                    <span class="field-type">{{ field.type }}</span>
                  </div>
                  }
                </div>
              </div>
              }
            </div>
          </mat-card-content>

          <mat-card-actions>
            <button
              mat-button
              color="primary"
              (click)="previewSchema(schema)"
              [disabled]="!schema.hasFields"
            >
              <mat-icon>visibility</mat-icon>
              Preview Form
            </button>
            <button mat-button (click)="loadInFormBuilder(schema)">
              <mat-icon>edit</mat-icon>
              Edit Schema
            </button>
          </mat-card-actions>
        </mat-card>
        }
      </div>
      }

      <!-- Schema Preview Modal -->
      @if (selectedSchema && showPreview) {
      <div class="preview-overlay" (click)="closePreview()">
        <div class="preview-modal" (click)="$event.stopPropagation()">
          <div class="preview-header">
            <h3>{{ selectedSchema.name }} - Form Preview</h3>
            <button mat-icon-button (click)="closePreview()">
              <mat-icon>close</mat-icon>
            </button>
          </div>
          <div class="preview-content">
            @if (selectedSchema.hasFields) {
            <app-schema-form-renderer
              [schemaJson]="selectedSchema.schemaJson"
              [formTitle]="selectedSchema.name"
              [showDebug]="false"
              [submitButtonText]="'Preview Only'"
              [showResetButton]="false"
              (formSubmitted)="onPreviewFormSubmitted($event)"
            />
            } @else {
            <div class="no-fields-message">
              <mat-icon>info</mat-icon>
              <p>This form schema has no fields to preview.</p>
            </div>
            }
          </div>
        </div>
      </div>
      }

      <!-- Submissions Modal -->
      @if (selectedSchema && showSubmissions) {
      <div class="preview-overlay" (click)="closeSubmissions()">
        <div class="preview-modal" (click)="$event.stopPropagation()">
          <div class="preview-header">
            <h3>{{ selectedSchema.name }} - Submissions</h3>
            <button mat-icon-button (click)="closeSubmissions()">
              <mat-icon>close</mat-icon>
            </button>
          </div>
          <div class="preview-content">
            @if (submissionsLoading) {
            <div class="loading-container">
              <mat-spinner diameter="50"></mat-spinner>
              <p>Loading submissions...</p>
            </div>
            } @else if (submissions.length === 0) {
            <div class="empty-state">
              <mat-icon class="empty-icon">description</mat-icon>
              <h3>No Submissions Found</h3>
              <p>No submissions found for this form schema.</p>
            </div>
            } @else {
            <table
              mat-table
              [dataSource]="submissionsDataSource"
              class="submissions-table"
            >
              <ng-container matColumnDef="id">
                <th mat-header-cell *matHeaderCellDef>ID</th>
                <td mat-cell *matCellDef="let submission">
                  {{ submission.id }}
                </td>
              </ng-container>
              <ng-container matColumnDef="submittedAt">
                <th mat-header-cell *matHeaderCellDef>Submitted At</th>
                <td mat-cell *matCellDef="let submission">
                  {{ formatDate(submission.submittedAt) }}
                </td>
              </ng-container>

              @for (column of allColumns; track column) { @if (column !== 'id'
              && column !== 'submittedAt' && column !== 'workPermitId' && column
              !== 'actions') {
              <ng-container matColumnDef="{{ column }}">
                <th mat-header-cell *matHeaderCellDef>
                  {{ getFieldDisplayName(column) }}
                </th>
                <td mat-cell *matCellDef="let submission">
                  {{ formatFieldValue(getFieldValue(submission, column)) }}
                </td>
              </ng-container>
              } }
              <ng-container matColumnDef="actions">
                <th mat-header-cell *matHeaderCellDef>Actions</th>
                <td mat-cell *matCellDef="let submission">
                  <button
                    mat-icon-button
                    (click)="viewSubmissionDetails(submission)"
                  >
                    <mat-icon>visibility</mat-icon>
                  </button>
                </td>
              </ng-container>
              <tr mat-header-row *matHeaderRowDef="allColumns"></tr>
              <tr mat-row *matRowDef="let row; columns: allColumns"></tr>
            </table>
            }
          </div>
        </div>
      </div>
      }
    </div>
  `,
  styles: [
    `
      .form-schemas-container {
        padding: 20px;
        max-width: 1400px;
        margin: 0 auto;
      }

      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 30px;
        padding-bottom: 20px;
        border-bottom: 1px solid #e0e0e0;
      }

      .header-content h2 {
        margin: 0 0 8px 0;
        color: #333;
        font-size: 28px;
        font-weight: 500;
      }

      .header-content p {
        margin: 0;
        color: #666;
        font-size: 16px;
      }

      .loading-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 80px 20px;
        text-align: center;
      }

      .loading-container p {
        margin-top: 16px;
        color: #666;
        font-size: 16px;
      }

      .empty-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 80px 20px;
        text-align: center;
      }

      .empty-icon {
        font-size: 64px;
        width: 64px;
        height: 64px;
        color: #ccc;
        margin-bottom: 16px;
      }

      .empty-state h3 {
        margin: 0 0 8px 0;
        color: #666;
        font-size: 24px;
      }

      .empty-state p {
        margin: 0;
        color: #999;
        font-size: 16px;
      }

      .schemas-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
        gap: 24px;
      }

      .schema-card {
        transition: all 0.3s ease;
        cursor: pointer;
        border: 2px solid transparent;
      }

      .schema-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
      }

      .schema-card.selected {
        border-color: #1976d2;
        box-shadow: 0 4px 20px rgba(25, 118, 210, 0.2);
      }

      .card-header-content {
        flex: 1;
      }

      .card-actions {
        display: flex;
        gap: 8px;
      }

      .schema-info {
        margin-top: 16px;
      }

      .info-chips {
        margin-bottom: 16px;
      }

      .warning-chip {
        background-color: #fff3cd;
        color: #856404;
      }

      .schema-preview {
        background: #f8f9fa;
        border-radius: 8px;
        padding: 16px;
        border: 1px solid #e9ecef;
      }

      .preview-title {
        margin: 0 0 12px 0;
        font-weight: 500;
        color: #333;
        font-size: 14px;
      }

      .fields-preview {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .field-item {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px 12px;
        background: white;
        border-radius: 6px;
        border: 1px solid #dee2e6;
      }

      .field-icon {
        font-size: 18px;
        width: 18px;
        height: 18px;
        color: #666;
      }

      .field-label {
        flex: 1;
        font-weight: 500;
        color: #333;
      }

      .field-type {
        font-size: 12px;
        color: #666;
        background: #f1f3f4;
        padding: 2px 8px;
        border-radius: 12px;
      }

      .preview-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        padding: 20px;
      }

      .preview-modal {
        background: white;
        border-radius: 12px;
        box-shadow: 0 24px 38px rgba(0, 0, 0, 0.14);
        max-width: 800px;
        width: 100%;
        max-height: 90vh;
        overflow-y: auto;
      }

      .preview-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 24px;
        border-bottom: 1px solid #e0e0e0;
      }

      .preview-header h3 {
        margin: 0;
        color: #333;
        font-size: 20px;
      }

      .preview-content {
        padding: 24px;
      }

      .no-fields-message {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 40px;
        text-align: center;
      }

      .no-fields-message mat-icon {
        font-size: 48px;
        width: 48px;
        height: 48px;
        color: #ffa726;
        margin-bottom: 16px;
      }

      .no-fields-message p {
        margin: 0;
        color: #666;
        font-size: 16px;
      }

      .submissions-table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 20px;
      }

      .submissions-table th,
      .submissions-table td {
        border: 1px solid #ddd;
        padding: 8px;
        text-align: left;
      }

      .submissions-table th {
        background-color: #f2f2f2;
        font-weight: bold;
      }

      .submissions-table tr:hover {
        background-color: #f5f5f5;
      }

      .submissions-table .actions-cell {
        text-align: center;
      }

      .delete-button {
        color: #f44336;
      }

      .delete-button:hover {
        background-color: rgba(244, 67, 54, 0.1);
      }

      @media (max-width: 768px) {
        .form-schemas-container {
          padding: 16px;
        }

        .schemas-grid {
          grid-template-columns: 1fr;
          gap: 16px;
        }

        .header {
          flex-direction: column;
          align-items: flex-start;
          gap: 16px;
        }

        .preview-modal {
          margin: 0;
          height: 100vh;
          border-radius: 0;
        }
      }
    `,
  ],
})
export class FormSchemasListComponent implements OnInit {
  @Output() schemaSelected = new EventEmitter<FormSchemaItem>();

  private backendService = inject(BackendApiService);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);
  private dialog = inject(MatDialog);

  formSchemas: ParsedFormSchema[] = [];
  selectedSchema: ParsedFormSchema | null = null;
  loading = false;
  showPreview = false;
  showSubmissions = false;
  submissionsLoading = false;
  submissions: FormSubmissionData[] = [];
  allColumns: string[] = [];
  displayedColumns: string[] = ['id', 'submittedAt', 'actions'];

  get submissionsDataSource() {
    return this.submissions;
  }

  ngOnInit() {
    this.loadFormSchemas();
  }

  loadFormSchemas() {
    this.loading = true;
    this.backendService.getFormSchemas().subscribe({
      next: (schemas) => {
        this.formSchemas = schemas.map((schema) => this.parseSchema(schema));
        console.log('Loaded form schemas:', this.formSchemas);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading form schemas:', error);
        this.snackBar.open('Failed to load form schemas', 'Close', {
          duration: 3000,
        });
        this.loading = false;
      },
    });
  }

  private parseSchema(schema: FormSchemaItem): ParsedFormSchema {
    let parsedSchema: any = null;
    let fieldCount = 0;
    let formType: 'legacy' | 'openapi' | 'unknown' = 'unknown';
    let hasFields = false;

    try {
      parsedSchema = JSON.parse(schema.schemaJson);

      // Detect form type and extract fields
      if (parsedSchema.openapi && parsedSchema.components?.schemas) {
        formType = 'openapi';
        const schemaKeys = Object.keys(parsedSchema.components.schemas);
        if (schemaKeys.length > 0) {
          const firstSchema = parsedSchema.components.schemas[schemaKeys[0]];
          if (firstSchema.properties) {
            fieldCount = Object.keys(firstSchema.properties).length;
            hasFields = fieldCount > 0;
          }
        }
      } else if (parsedSchema.type === 'object' && parsedSchema.properties) {
        formType = 'legacy';
        fieldCount = Object.keys(parsedSchema.properties).length;
        hasFields = fieldCount > 0;
      } else if (parsedSchema.fields && Array.isArray(parsedSchema.fields)) {
        formType = 'legacy';
        fieldCount = parsedSchema.fields.length;
        hasFields = fieldCount > 0;
      }
    } catch (error) {
      console.error('Error parsing schema for form:', schema.name, error);
    }

    return {
      ...schema,
      parsedSchema,
      fieldCount,
      formType,
      hasFields,
    };
  }

  refreshSchemas() {
    this.loadFormSchemas();
  }

  navigateToCreate() {
    this.router.navigate(['/form-builder'], { state: { create: true } });
  }

  previewSchema(schema: ParsedFormSchema) {
    if (!schema.hasFields) {
      this.snackBar.open('This form has no fields to preview', 'Close', {
        duration: 3000,
      });
      return;
    }

    this.selectedSchema = schema;
    this.showPreview = true;
  }

  closePreview() {
    this.showPreview = false;
    this.selectedSchema = null;
  }

  loadInFormBuilder(schema: ParsedFormSchema) {
    // Pass only properties needed by the builder and mark as edit mode
    const minimalSchema = {
      id: schema.id,
      name: schema.name,
      schemaJson: schema.schemaJson,
    } as FormSchemaItem;

    // If we're already in the form-builder page (embedded list), emit to parent
    if (this.router.url.includes('form-builder')) {
      this.schemaSelected.emit(minimalSchema);
      return;
    }

    // Otherwise navigate to the builder route with the schema in navigation state
    this.router.navigate(['/form-builder'], {
      state: { schema: minimalSchema, edit: true },
    });
  }

  onPreviewFormSubmitted(formData: any) {
    console.log('Preview form submitted:', formData);
    this.snackBar.open('Form preview - data would be submitted', 'Close', {
      duration: 3000,
    });
  }

  viewSubmissions(schema: ParsedFormSchema) {
    this.selectedSchema = schema;
    this.showSubmissions = true;
    this.loadFormSubmissions(schema.id);
  }

  closeSubmissions() {
    this.showSubmissions = false;
    this.selectedSchema = null;
    this.submissions = [];
  }

  loadFormSubmissions(formDefinitionId: number) {
    this.submissionsLoading = true;
    this.backendService
      .getFormDefinitionSubmissions(formDefinitionId)
      .subscribe({
        next: (submissions: FormSubmission[]) => {
          console.log('Form submissions loaded:', submissions);
          this.submissions = submissions.map((submission) =>
            this.parseSubmissionData(submission)
          );
          this.generateTableColumns();
          this.submissionsLoading = false;
        },
        error: (error) => {
          console.error('Error loading form submissions:', error);
          this.snackBar.open('Failed to load form submissions', 'Close', {
            duration: 3000,
          });
          this.submissionsLoading = false;
        },
      });
  }

  private parseSubmissionData(submission: FormSubmission): FormSubmissionData {
    let parsedData = null;
    let fieldValues: { [key: string]: any } = {};

    try {
      parsedData = JSON.parse(submission.dataJson);
      fieldValues = parsedData;
    } catch (error) {
      console.error('Error parsing submission data:', error);
    }

    return {
      id: submission.id,
      dataJson: submission.dataJson,
      submittedAt: submission.submittedAt || new Date().toISOString(),
      formDefinitionId: submission.formDefinitionId || 0,
      parsedData,
      fieldValues,
    };
  }

  private generateTableColumns() {
    if (this.submissions.length === 0) {
      this.allColumns = this.displayedColumns;
      return;
    }

    // Get all unique field keys from submissions
    const allKeys = new Set<string>();
    this.submissions.forEach((submission) => {
      if (submission.fieldValues) {
        Object.keys(submission.fieldValues).forEach((key) => allKeys.add(key));
      }
    });

    // Create columns: standard columns + dynamic field columns
    this.allColumns = [
      'id',
      'submittedAt',
      ...Array.from(allKeys).sort(),
      'actions',
    ];
  }

  getFieldValue(submission: FormSubmissionData, fieldKey: string): any {
    return submission.fieldValues?.[fieldKey] || '';
  }

  formatFieldValue(value: any): string {
    if (value === null || value === undefined) return '';
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    if (typeof value === 'object') return JSON.stringify(value);
    return String(value);
  }

  viewSubmissionDetails(submission: FormSubmissionData) {
    console.log('Viewing submission details:', submission);
    this.snackBar.open(`Viewing submission ${submission.id} details`, 'Close', {
      duration: 2000,
    });
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  getFormTypeLabel(type: string): string {
    switch (type) {
      case 'openapi':
        return 'OpenAPI 3.0';
      case 'legacy':
        return 'Legacy Schema';
      default:
        return 'Unknown';
    }
  }

  getSchemaFields(schema: ParsedFormSchema): any[] {
    if (!schema.parsedSchema || !schema.hasFields) return [];

    let properties: any = {};

    if (
      schema.formType === 'openapi' &&
      schema.parsedSchema.components?.schemas
    ) {
      const schemaKeys = Object.keys(schema.parsedSchema.components.schemas);
      if (schemaKeys.length > 0) {
        const firstSchema =
          schema.parsedSchema.components.schemas[schemaKeys[0]];
        properties = firstSchema.properties || {};
      }
    } else if (schema.parsedSchema.properties) {
      properties = schema.parsedSchema.properties;
    }

    return Object.entries(properties).map(([key, prop]: [string, any]) => ({
      key,
      label: prop.title || key,
      type: this.getFieldType(prop),
    }));
  }

  private getFieldType(property: any): string {
    if (property.format === 'email') return 'email';
    if (property.format === 'date') return 'date';
    if (property.type === 'boolean') return 'checkbox';
    if (property.enum) return property.enum.length <= 3 ? 'radio' : 'select';
    if (property.type === 'number' || property.type === 'integer')
      return 'number';
    return 'text';
  }

  getFieldIcon(type: string): string {
    switch (type) {
      case 'text':
        return 'text_fields';
      case 'email':
        return 'email';
      case 'number':
        return 'numbers';
      case 'checkbox':
        return 'check_box';
      case 'radio':
        return 'radio_button_checked';
      case 'select':
        return 'arrow_drop_down';
      case 'date':
        return 'date_range';
      default:
        return 'input';
    }
  }

  getFieldDisplayName(fieldKey: string): string {
    // Try to get the field name from the selected schema
    if (this.selectedSchema && this.selectedSchema.parsedSchema) {
      try {
        // Handle OpenAPI schema format
        if (
          this.selectedSchema.formType === 'openapi' &&
          this.selectedSchema.parsedSchema.components?.schemas
        ) {
          const schemaKeys = Object.keys(
            this.selectedSchema.parsedSchema.components.schemas
          );
          if (schemaKeys.length > 0) {
            const firstSchema =
              this.selectedSchema.parsedSchema.components.schemas[
                schemaKeys[0]
              ];
            if (firstSchema.properties && firstSchema.properties[fieldKey]) {
              return (
                firstSchema.properties[fieldKey].title ||
                firstSchema.properties[fieldKey].description ||
                fieldKey
              );
            }
          }
        }
        // Handle legacy schema format
        else if (
          this.selectedSchema.parsedSchema.properties &&
          this.selectedSchema.parsedSchema.properties[fieldKey]
        ) {
          return (
            this.selectedSchema.parsedSchema.properties[fieldKey].title ||
            this.selectedSchema.parsedSchema.properties[fieldKey].description ||
            fieldKey
          );
        }
        // Handle fields array format
        else if (
          this.selectedSchema.parsedSchema.fields &&
          Array.isArray(this.selectedSchema.parsedSchema.fields)
        ) {
          const field = this.selectedSchema.parsedSchema.fields.find(
            (f: any) => f.id === fieldKey
          );
          if (field && field.name) {
            return field.name;
          }
        }
      } catch (error) {
        console.error('Error getting field display name:', error);
      }
    }

    // Fallback: format the key nicely
    return fieldKey.charAt(0).toUpperCase() + fieldKey.slice(1);
  }

  deleteSchema(schema: ParsedFormSchema) {
    const dialogRef = this.dialog.open(ConfirmDeleteDialogComponent, {
      width: '400px',
      data: {
        title: 'Delete Form Schema',
        message: `Are you sure you want to delete "${schema.name}"? This action cannot be undone.`,
        confirmText: 'Delete',
        cancelText: 'Cancel',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.performDelete(schema);
      }
    });
  }

  private performDelete(schema: ParsedFormSchema) {
    this.loading = true;
    this.backendService.deleteFormDefinition(schema.id).subscribe({
      next: () => {
        this.snackBar.open(
          `Form schema "${schema.name}" deleted successfully`,
          'Close',
          {
            duration: 3000,
          }
        );
        this.loadFormSchemas(); // Refresh the list
      },
      error: (error) => {
        console.error('Error deleting form schema:', error);
        this.snackBar.open('Failed to delete form schema', 'Close', {
          duration: 3000,
        });
        this.loading = false;
      },
    });
  }
}
