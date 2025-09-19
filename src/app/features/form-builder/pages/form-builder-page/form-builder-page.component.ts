import { Component, OnInit, inject, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  MatDialogModule,
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormElementsMenuComponent } from '../../components/form-elements-menu/form-elements-menu.component';
import { MainCanvasComponent } from '../../components/main-canvas/main-canvas.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import {
  BackendApiService,
  FormSchemaItem,
} from '../../services/backend-api.service';
import { FormDefinition } from '../../models/field';
import { FormService } from '../../services/form.service';
import { FormExportComponent } from '../../components/form-export/form-export.component';
import { FormExportService } from '../../services/form-export.service';
import { FormSchemasListComponent } from '../../components/form-schemas-list/form-schemas-list.component';

@Component({
  selector: 'app-form-builder-page',
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule,
    MatDialogModule,
    MatCardModule,
    MatChipsModule,
    MatTooltipModule,
    MatFormFieldModule,
    MatInputModule,
    FormElementsMenuComponent,
    MainCanvasComponent,
    DragDropModule,
    FormSchemasListComponent,
  ],
  template: `
    <div class="form-builder-page">
      <!-- Header Section -->
      <div class="page-header">
        <div class="header-content">
          <div class="header-left" *ngIf="currentForm">
            <button
              mat-stroked-button
              (click)="navigateToSchemas()"
              class="action-button"
            >
              <mat-icon>arrow_back</mat-icon>
              Back to Schemas
            </button>
            <mat-form-field
              *ngIf="editingForm"
              appearance="outline"
              class="name-input mt-5"
            >
              <mat-label>Form Name (optional)</mat-label>
              <input matInput [(ngModel)]="currentForm.name" />
            </mat-form-field>
          </div>
          <div class="header-actions">
            <button
              mat-raised-button
              color="primary"
              (click)="createNewForm()"
              *ngIf="!currentForm"
              class="action-button"
            >
              <mat-icon>add</mat-icon>
              Create New Form
            </button>

            <!-- Update button visible when editing; disabled until there are changes -->
            <button
              mat-raised-button
              color="primary"
              (click)="saveFormChanges()"
              *ngIf="currentForm && editingForm"
              [disabled]="!hasFormChanges()"
              class="action-button mt-10"
            >
              <mat-icon>save</mat-icon>
              Update Scheme
            </button>

            <!-- Save new form (create) -->
            <button
              mat-stroked-button
              (click)="saveCurrentForm()"
              *ngIf="currentForm && !editingForm"
              class="action-button"
            >
              <mat-icon>save</mat-icon>
              Save Form
            </button>

            <!-- Export only when not editing existing scheme -->
            <button
              mat-raised-button
              color="accent"
              (click)="openExportDialog()"
              *ngIf="currentForm && hasFormFields() && !editingForm"
              class="action-button"
              matTooltip="Export form to backend"
            >
              <mat-icon>download</mat-icon>
              Export Form
            </button>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="page-content">
        <div *ngIf="!currentForm" class="empty-state">
          <app-form-schemas-list (schemaSelected)="onSchemaSelected($event)" />
        </div>
        <div
          *ngIf="currentForm"
          class="form-builder-container"
          [class.sidebar-hidden]="isPreviewMode"
          cdkDropListGroup
        >
          <div class="sidebar-left" *ngIf="!isPreviewMode">
            <app-form-elements-menu />
            <!-- Form Status moved to sidebar -->
            <div class="form-status-sidebar" *ngIf="currentForm">
              <div class="status-info">
                <mat-icon class="status-icon">description</mat-icon>
                <span class="form-name">{{ currentForm.name }}</span>
                <mat-chip-set>
                  <mat-chip [highlighted]="hasFormFields()" class="status-chip">
                    {{ getFieldCount() }}
                    {{ getFieldCount() === 1 ? 'Field' : 'Fields' }}
                  </mat-chip>
                  <mat-chip *ngIf="editingForm" class="status-chip editing">
                    <mat-icon>edit</mat-icon>
                    Editing
                  </mat-chip>
                </mat-chip-set>
              </div>
            </div>
          </div>
          <app-main-canvas
            class="main-content"
            (previewModeChanged)="onPreviewModeChanged($event)"
          />
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .form-builder-page {
        display: flex;
        flex-direction: column;
        height: 100%;
        background: #f8fafc;
      }

      .page-header {
        background: white;
        border-bottom: 1px solid #e2e8f0;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        z-index: 10;
      }

      .header-content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 16px 32px;
      }

      .header-left {
        flex: 1;
      }

      .name-input {
        margin-left: 16px;
        width: 280px;
      }

      .page-title {
        margin: 0 0 8px 0;
        color: #1e293b;
        font-size: 28px;
        font-weight: 600;
        line-height: 1.2;
      }

      .page-subtitle {
        margin: 0;
        color: #64748b;
        font-size: 16px;
        font-weight: 400;
      }

      .header-actions {
        display: flex;
        gap: 12px;
        align-items: center;
      }

      .action-button {
        display: flex;
        align-items: center;
        gap: 8px;
        font-weight: 500;
        border-radius: 8px;
        padding: 8px 16px;
        transition: all 0.2s ease;
      }

      .action-button:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      }

      .status-info {
        display: flex;
        align-items: center;
        gap: 12px;
      }

      .status-icon {
        color: #64748b;
        font-size: 20px;
        width: 20px;
        height: 20px;
      }

      .form-name {
        font-weight: 600;
        color: #1e293b;
        font-size: 16px;
      }

      .status-chip {
        font-size: 12px;
        height: 24px;
        border-radius: 12px;
      }

      .status-chip.editing {
        background: #dbeafe;
        color: #1d4ed8;
      }

      .page-content {
        flex: 1;
        overflow: hidden;
        display: flex;
        flex-direction: column;
      }

      .empty-state {
        width: 100%;
        height: 100%;
      }

      .empty-content {
        text-align: center;
        max-width: 480px;
      }

      .empty-icon {
        margin-bottom: 24px;
      }

      .empty-icon mat-icon {
        font-size: 80px;
        width: 80px;
        height: 80px;
        color: #cbd5e1;
      }

      .empty-content h2 {
        margin: 0 0 16px 0;
        color: #1e293b;
        font-size: 24px;
        font-weight: 600;
      }

      .empty-content p {
        margin: 0 0 32px 0;
        color: #64748b;
        font-size: 16px;
        line-height: 1.5;
      }

      .empty-actions {
        display: flex;
        gap: 16px;
        justify-content: center;
        flex-wrap: wrap;
      }

      .primary-action,
      .secondary-action {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 12px 24px;
        font-weight: 500;
        border-radius: 8px;
        transition: all 0.2s ease;
      }

      .primary-action:hover,
      .secondary-action:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
      }

      .form-builder-container {
        display: flex;
        flex: 1;
        gap: 0;
        height: 100%;
        overflow: hidden;
      }

      .sidebar-left {
        width: 300px;
        min-width: 220px;
        background: white;
        border-right: 1px solid #e2e8f0;
        overflow-y: auto;
        max-height: calc(100vh - 120px);
        flex-shrink: 0;
        display: flex;
        flex-direction: column;
      }

      .form-status-sidebar {
        background: #f1f5f9;
        border-top: 1px solid #e2e8f0;
        padding: 16px;
        margin-top: auto;
        flex-shrink: 0;
      }

      .form-status-sidebar .status-info {
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
      }

      .form-status-sidebar .form-name {
        font-size: 14px;
        width: 100%;
        word-break: break-word;
      }

      .form-status-sidebar .status-chip {
        font-size: 11px;
        height: 20px;
      }

      .main-content {
        flex: 1 1 auto;
        min-width: 0;
        min-height: 0;
        background: #f8fafc;
        overflow-y: auto;
        transition: all 0.3s ease;
      }

      .form-builder-container.sidebar-hidden .main-content {
        flex: 1 1 100%;
        width: 100%;
        max-width: none;
      }

      /* Responsive Design */
      @media (max-width: 1200px) {
        .sidebar-left {
          width: 280px;
          min-width: 280px;
        }
      }

      @media (max-width: 1024px) {
        .header-content {
          padding: 16px 24px;
        }

        .page-title {
          font-size: 24px;
        }

        .page-subtitle {
          font-size: 14px;
        }

        .sidebar-left {
          width: 260px;
          min-width: 260px;
        }
      }

      @media (max-width: 768px) {
        .header-content {
          flex-direction: column;
          align-items: flex-start;
          gap: 16px;
          padding: 12px 20px;
        }

        .header-actions {
          width: 100%;
          justify-content: flex-start;
          flex-wrap: wrap;
        }

        .action-button {
          flex: 1;
          min-width: 120px;
        }

        .form-builder-container {
          flex-direction: column;
        }

        .sidebar-left {
          width: 100%;
          min-width: auto;
          height: auto;
          max-height: 350px;
        }

        .form-status-sidebar {
          margin-top: 0;
          border-top: none;
          border-bottom: 1px solid #e2e8f0;
        }

        .main-content {
          flex: 1;
          min-height: 400px;
        }

        .empty-actions {
          flex-direction: column;
          align-items: center;
        }

        .primary-action,
        .secondary-action {
          width: 100%;
          max-width: 280px;
          justify-content: center;
        }
      }

      @media (max-width: 480px) {
        .header-content {
          padding: 12px 16px;
        }

        .page-title {
          font-size: 20px;
        }

        .page-subtitle {
          font-size: 13px;
        }

        .action-button {
          padding: 6px 12px;
          font-size: 14px;
        }

        .empty-content {
          padding: 20px;
        }

        .empty-icon mat-icon {
          font-size: 60px;
          width: 60px;
          height: 60px;
        }

        .empty-content h2 {
          font-size: 20px;
        }

        .empty-content p {
          font-size: 14px;
        }
      }
    `,
  ],
})
export class FormBuilderPageComponent implements OnInit {
  currentForm: FormDefinition | null = null;
  editingForm: any | null = null;
  private originalSchemaJson: string = '';
  private hasUnsavedChanges = false;
  isPreviewMode = false;

  private backendApiService = inject(BackendApiService);
  private snackBar = inject(MatSnackBar);
  private formService = inject(FormService);
  private dialog = inject(MatDialog);
  private router = inject(Router);
  private formExportService = inject(FormExportService);

  ngOnInit() {
    const navState: any = history.state;
    if (navState && navState.schema) {
      this.onSchemaSelected(navState.schema);
      // If explicitly routed as edit mode, ensure editingForm is set
      if (navState.edit && navState.schema?.id) {
        this.editingForm = {
          id: navState.schema.id,
          name: navState.schema.name,
          schemaJson: navState.schema.schemaJson,
        };
        this.originalSchemaJson = navState.schema.schemaJson;
        this.hasUnsavedChanges = false;
        this.startChangeDetection();
      }
    } else if (navState && navState.create) {
      this.createNewForm();
    }
  }

  onPreviewModeChanged(isPreview: boolean): void {
    this.isPreviewMode = isPreview;
  }

  createNewForm() {
    this.currentForm = {
      id: this.generateFormId(),
      name: 'New Form',
      fields: [],
      settings: {
        submitButtonText: 'Submit',
        showResetButton: true,
        resetButtonText: 'Reset',
        layout: 'vertical',
      },
    };
    this.editingForm = null;
    this.originalSchemaJson = '';
    this.hasUnsavedChanges = false;
    this.formService.clearForm();
  }

  navigateToSchemas() {
    const hasChanges = this.hasFormChanges() || this.getFieldCount() > 0;

    if (!hasChanges) {
      this.resetBuilderState();
      return;
    }

    const dialogRef = this.dialog.open(ConfirmLeaveDialogComponent, {
      width: '420px',
      data: {
        title: 'Unsaved changes',
        message:
          'You have unsaved changes. Save your form first or discard changes before leaving.',
      },
      disableClose: true,
    });

    dialogRef
      .afterClosed()
      .subscribe((result: 'save' | 'discard' | 'cancel') => {
        if (result === 'save') {
          if (this.editingForm) {
            this.saveFormChanges();
          } else {
            this.saveCurrentForm();
          }
          this.resetBuilderState();
        } else if (result === 'discard') {
          this.resetBuilderState();
        }
        // cancel does nothing
      });
  }

  private resetBuilderState(): void {
    this.currentForm = null;
    this.editingForm = null;
    this.originalSchemaJson = '';
    this.hasUnsavedChanges = false;
    this.formService.clearForm();
  }

  getFieldCount(): number {
    return this.formService.getFormFields().length;
  }

  hasFormFields(): boolean {
    return this.getFieldCount() > 0;
  }

  hasFormChanges(): boolean {
    return this.hasUnsavedChanges;
  }

  // Update form name when exporting
  updateFormName(newName: string) {
    if (this.currentForm) {
      this.currentForm.name = newName;
    }
  }

  loadFormDefinition(formId: number) {
    this.backendApiService.getFormDefinition(formId).subscribe({
      next: (formData) => {
        this.currentForm = formData;
        this.formService.loadFormDefinition(formData);
        this.snackBar.open(
          `Form "${formData.name}" loaded successfully`,
          'Close',
          {
            duration: 3000,
          }
        );
      },
      error: (error) => {
        console.error('Error loading form:', error);
        this.snackBar.open('Failed to load form. Please try again.', 'Close', {
          duration: 3000,
        });
      },
    });
  }

  saveCurrentForm() {
    if (!this.currentForm) return;

    if (this.editingForm) {
      // Update existing form
      const exportFormDef: FormDefinition = {
        id: this.currentForm.id,
        name: this.currentForm.name,
        fields: this.formService.getFormFields(),
        settings: this.currentForm.settings,
      } as any;
      (exportFormDef as any).rows = this.formService.getRowsSnapshot();
      const backendExport = this.formExportService.exportToBackend(
        exportFormDef,
        false,
        this.formService.getRowsSnapshot()
      );
      const updateData = {
        id: this.editingForm.id,
        name: this.currentForm.name,
        schemaJson: backendExport.schemaJson,
      };

      this.backendApiService.updateFormDefinition(updateData).subscribe({
        next: (response) => {
          this.snackBar.open(
            `Form "${this.currentForm!.name}" updated successfully`,
            'Close',
            {
              duration: 3000,
            }
          );
          // Return to schemas after successful update
          this.resetBuilderState();
        },
        error: (error) => {
          console.error('Error updating form:', error);
          this.snackBar.open(
            'Failed to update form. Please try again.',
            'Close',
            {
              duration: 3000,
            }
          );
        },
      });
    } else {
      // Create new form with unique random name
      const uniqueName = this.generateUniqueFormName();
      const exportFormDef: FormDefinition = {
        id: this.currentForm.id,
        name: uniqueName,
        fields: this.formService.getFormFields(),
        settings: this.currentForm.settings,
      } as any;
      const rowsSnapshot = this.formService.getRowsSnapshot();
      console.log('Rows snapshot for saveCurrentForm (create):', rowsSnapshot);
      console.log(
        'Current formService.rows() (create):',
        this.formService.rows()
      );
      const backendExport = this.formExportService.exportToBackend(
        exportFormDef,
        false,
        rowsSnapshot
      );
      const createData = {
        name: uniqueName,
        schemaJson: backendExport.schemaJson,
      };

      this.backendApiService.createFormDefinition(createData).subscribe({
        next: (response) => {
          this.snackBar.open(
            `Form "${uniqueName}" created successfully`,
            'Close',
            {
              duration: 3000,
            }
          );
          // Return to schemas after successful create
          this.resetBuilderState();
        },
        error: (error) => {
          console.error('Error creating form:', error);
          this.snackBar.open(
            'Failed to create form. Please try again.',
            'Close',
            {
              duration: 3000,
            }
          );
        },
      });
    }
  }

  private generateFormId(): string {
    return 'form_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  private generateUniqueFormName(): string {
    const timestamp = new Date()
      .toISOString()
      .slice(0, 19)
      .replace(/[-:T]/g, '');
    const randomSuffix = Math.random().toString(36).substr(2, 6);
    return `Form_${timestamp}_${randomSuffix}`;
  }

  // Open export dialog
  openExportDialog() {
    const fields = this.formService.getFormFields();
    if (fields.length === 0) {
      this.snackBar.open(
        'Please add some fields to your form first.',
        'Close',
        {
          duration: 3000,
        }
      );
      return;
    }

    const dialogRef = this.dialog.open(FormExportComponent, {
      width: '800px',
      data: {
        fields: fields,
        formName: this.currentForm?.name || 'My Form',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.formName) {
        // Update form name if changed during export
        this.updateFormName(result.formName);
        this.snackBar.open('Form exported successfully!', 'Close', {
          duration: 3000,
        });
        // Reset when export succeeded (backend or JSON-only path)
        const backendOk = (result as any).backendExported === true;
        const jsonOnlyOk = (result as any).backendExportAttempted === false;
        if (backendOk || jsonOnlyOk) this.resetBuilderState();
      } else if (result === null) {
        // Dialog was cancelled
        console.log('Export dialog was cancelled');
      }
    });
  }

  // Handle schema selection from Form Schemas tab
  onSchemaSelected(schema: FormSchemaItem): void {
    console.log('Schema selected:', schema);

    try {
      const parsedSchema = JSON.parse(schema.schemaJson);
      let formDefinition: FormDefinition;

      // Handle different schema formats
      if (parsedSchema.openapi && parsedSchema.components?.schemas) {
        // If layout extension exists and has rows, restore rows instead of single-row flatten
        if (
          parsedSchema['x-layout']?.rows &&
          parsedSchema['x-layout'].rows.length > 0
        ) {
          const rows = parsedSchema['x-layout'].rows as Array<{
            id: string;
            fields: any[];
          }>;
          const allFields: any[] = [];
          rows.forEach((r) => {
            r.fields.forEach((f) => allFields.push(f));
          });
          // Build form definition preserving fields
          formDefinition = {
            id: `form_${Date.now()}_loaded`,
            name: schema.name,
            fields: allFields as any,
            settings: {
              submitButtonText: 'Submit',
              showResetButton: true,
              resetButtonText: 'Reset',
              layout: 'vertical',
            },
          };
          // Set rows directly for editor layout (this preserves the multi-row structure)
          this.formService.setRows(rows as any);
        } else {
          // OpenAPI format - convert to form definition (fallback for empty x-layout or no x-layout)
          const schemaKeys = Object.keys(parsedSchema.components.schemas);
          if (schemaKeys.length > 0) {
            const firstSchema = parsedSchema.components.schemas[schemaKeys[0]];
            formDefinition = this.convertOpenAPIToFormDefinition(
              firstSchema,
              schema.name
            );
            // Load the form definition normally (will create a single row with all fields)
            this.formService.loadFormDefinition(formDefinition);
          } else {
            throw new Error('No schemas found in OpenAPI specification');
          }
        }
      } else if (parsedSchema.type === 'object' && parsedSchema.properties) {
        // Legacy JSON Schema format
        formDefinition = this.convertJSONSchemaToFormDefinition(
          parsedSchema,
          schema.name
        );
      } else if (parsedSchema.fields && Array.isArray(parsedSchema.fields)) {
        // Our internal format
        formDefinition = parsedSchema;
      } else {
        throw new Error('Unsupported schema format');
      }

      // Load the form definition
      this.currentForm = formDefinition;
      // Only load form definition if not already loaded (x-layout case loads it directly)
      if (
        !parsedSchema['x-layout']?.rows ||
        parsedSchema['x-layout'].rows.length === 0
      ) {
        this.formService.loadFormDefinition(formDefinition);
      }

      // Set editing mode with schema info
      this.editingForm = {
        id: schema.id,
        name: schema.name,
        schemaJson: schema.schemaJson,
      };

      // Store original schema for change detection
      this.originalSchemaJson = schema.schemaJson;
      this.hasUnsavedChanges = false;

      // Enable change detection
      this.startChangeDetection();

      this.snackBar.open(`Loaded "${schema.name}" for editing!`, 'Close', {
        duration: 3000,
      });
    } catch (error) {
      console.error('Error loading schema:', error);
      this.snackBar.open(`Failed to load "${schema.name}": ${error}`, 'Close', {
        duration: 5000,
      });
    }
  }

  private convertOpenAPIToFormDefinition(
    schema: any,
    formName: string
  ): FormDefinition {
    const fields = [];

    if (schema.properties) {
      for (const [key, property] of Object.entries(schema.properties)) {
        const prop = property as any;
        fields.push({
          id: key,
          type: this.getFieldTypeFromProperty(prop),
          label: prop.title || key,
          placeholder: prop.description || '',
          required: schema.required?.includes(key) || !prop.nullable,
          validations: [],
          options: prop.enum || [],
          settings: {
            min: prop.minimum,
            max: prop.maximum,
            minLength: prop.minLength,
            maxLength: prop.maxLength,
            pattern: prop.pattern,
          },
        });
      }
    }

    return {
      id: `form_${Date.now()}_loaded`,
      name: formName,
      fields: fields,
      settings: {
        submitButtonText: 'Submit',
        showResetButton: true,
        resetButtonText: 'Reset',
        layout: 'vertical',
      },
    };
  }

  private convertJSONSchemaToFormDefinition(
    schema: any,
    formName: string
  ): FormDefinition {
    const fields = [];

    if (schema.properties) {
      for (const [key, property] of Object.entries(schema.properties)) {
        const prop = property as any;
        fields.push({
          id: key,
          type: this.getFieldTypeFromProperty(prop),
          label: prop.title || key,
          placeholder: prop.description || '',
          required: schema.required?.includes(key) || false,
          validations: [],
          options: prop.enum || [],
          settings: {
            min: prop.minimum,
            max: prop.maximum,
            minLength: prop.minLength,
            maxLength: prop.maxLength,
            pattern: prop.pattern,
          },
        });
      }
    }

    return {
      id: `form_${Date.now()}_loaded`,
      name: formName,
      fields: fields,
      settings: {
        submitButtonText: 'Submit',
        showResetButton: true,
        resetButtonText: 'Reset',
        layout: 'vertical',
      },
    };
  }

  private getFieldTypeFromProperty(property: any): string {
    if (property.format === 'email') return 'email';
    if (property.format === 'date') return 'date';
    if (property.type === 'boolean') return 'checkbox';
    if (property.enum) {
      return property.enum.length <= 3 ? 'radio' : 'select';
    }
    if (property.type === 'number' || property.type === 'integer')
      return 'number';
    if (
      property.type === 'string' &&
      property.maxLength &&
      property.maxLength > 100
    )
      return 'textarea';
    return 'text';
  }

  // New methods for form editing functionality
  private startChangeDetection(): void {
    // Listen to form service changes to detect modifications
    // We'll use a simple interval check since FormService doesn't have observables
    setInterval(() => {
      this.checkForChanges();
    }, 1000); // Check every second
  }

  private checkForChanges(): void {
    if (!this.editingForm || !this.originalSchemaJson) {
      this.hasUnsavedChanges = false;
      return;
    }

    try {
      // Get current form schema
      const currentSchema = this.getCurrentFormSchema();

      // Compare with original
      this.hasUnsavedChanges = currentSchema !== this.originalSchemaJson;
    } catch (error) {
      console.error('Error checking for changes:', error);
      this.hasUnsavedChanges = true; // Assume changes if we can't compare
    }
  }

  private getCurrentFormSchema(): string {
    if (!this.currentForm) return '';

    // Get current form data from FormService
    const currentFormDefinition: FormDefinition = {
      id: this.currentForm.id,
      name: this.currentForm.name,
      fields: this.formService.getFormFields(),
      settings: this.currentForm.settings,
    } as any;
    (currentFormDefinition as any).rows = this.formService.getRowsSnapshot();

    return JSON.stringify(currentFormDefinition);
  }

  saveFormChanges(): void {
    if (!this.editingForm || !this.currentForm) {
      this.snackBar.open('No form to save', 'Close', { duration: 3000 });
      return;
    }

    // Build OpenAPI-style schemaJson like create/export so cards/preview can parse fields
    const exportFormDef: FormDefinition = {
      id: this.currentForm.id,
      name: this.currentForm.name,
      fields: this.formService.getFormFields(),
      settings: this.currentForm.settings,
    };
    const rowsSnapshot = this.formService.getRowsSnapshot();
    console.log('Rows snapshot for saveFormChanges:', rowsSnapshot);
    console.log('Current formService.rows():', this.formService.rows());
    const backendExport = this.formExportService.exportToBackend(
      exportFormDef,
      false,
      rowsSnapshot
    );

    const updateData = {
      id: this.editingForm.id,
      name: this.currentForm.name,
      schemaJson: backendExport.schemaJson,
    };

    this.backendApiService.updateFormDefinition(updateData).subscribe({
      next: (response) => {
        this.snackBar.open(
          `Form "${this.currentForm!.name}" saved successfully!`,
          'Close',
          { duration: 3000 }
        );

        // Update original schema and reset change tracking
        this.originalSchemaJson = updateData.schemaJson;
        this.hasUnsavedChanges = false;
        // Return to schemas after successful save
        this.resetBuilderState();
      },
      error: (error) => {
        console.error('Error saving form:', error);
        this.snackBar.open('Failed to save form. Please try again.', 'Close', {
          duration: 3000,
        });
      },
    });
  }

  // Router guard hook
  canDeactivate(): boolean | Promise<boolean> {
    if (!this.currentForm) {
      return true;
    }

    const hasChanges = this.hasFormChanges() || this.getFieldCount() > 0;
    if (!hasChanges) {
      return true;
    }

    const dialogRef = this.dialog.open(ConfirmLeaveDialogComponent, {
      width: '420px',
      data: {
        title: 'Unsaved changes',
        message:
          'You have unsaved changes. Save your form first or discard changes before leaving.',
      },
      disableClose: true,
    });

    return new Promise<boolean>((resolve) => {
      dialogRef
        .afterClosed()
        .subscribe((result: 'save' | 'discard' | 'cancel') => {
          if (result === 'save') {
            if (this.editingForm) {
              this.saveFormChanges();
            } else {
              this.saveCurrentForm();
            }
            resolve(true);
          } else if (result === 'discard') {
            this.currentForm = null;
          } else {
            resolve(false);
          }
        });
    });
  }
}

@Component({
  selector: 'app-confirm-leave-dialog',
  template: `
    <h2 mat-dialog-title>{{ data.title }}</h2>
    <mat-dialog-content>
      <p>{{ data.message }}</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Cancel</button>
      <button mat-button color="warn" (click)="onDiscard()">Discard</button>
      <button mat-raised-button color="primary" (click)="onSave()">Save</button>
    </mat-dialog-actions>
  `,
  standalone: true,
  imports: [MatButtonModule, MatDialogModule],
})
export class ConfirmLeaveDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmLeaveDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { title: string; message: string }
  ) {}

  onSave() {
    this.dialogRef.close('save');
  }

  onDiscard() {
    this.dialogRef.close('discard');
  }

  onCancel() {
    this.dialogRef.close('cancel');
  }
}
