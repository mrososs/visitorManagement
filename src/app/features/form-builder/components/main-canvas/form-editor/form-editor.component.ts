import { Component, inject } from '@angular/core';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { FormService } from '../../../services/form.service';
import { FieldTypeDefinition, FormField } from '../../../models/field';
import { FormFieldComponent } from '../form-field/form-field.component';
import { CommonModule } from '@angular/common';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-form-editor',
  imports: [
    DragDropModule,
    FormFieldComponent,
    CommonModule,
    MatButton,
    MatIconButton,
    MatIcon,
  ],
  template: `
    <div class="form-editor-container">
      @for (row of formService.rows(); track row.id) {
      <div
        cdkDropList
        [id]="row.id"
        (cdkDropListDropped)="onDropInRow($event, row.id)"
        [cdkDropListData]="row.id"
        [cdkDropListConnectedTo]="connectedDropIds()"
        [cdkDropListOrientation]="'mixed'"
        class="form-row"
      >
        <div class="row-header">
          <div class="row-info">
            <mat-icon class="row-icon">view_column</mat-icon>
            <span class="row-label">Row {{ $index + 1 }}</span>
          </div>
          <button
            mat-icon-button
            (click)="formService.deleteRow(row.id)"
            class="delete-row-btn"
            [disabled]="formService.rows().length === 1"
          >
            <mat-icon>delete</mat-icon>
          </button>
        </div>
        <div class="row-content">
          @for(field of row.fields; track field.id){
          <app-form-field
            cdkDrag
            [cdkDragData]="field"
            class="field-wrapper"
            [field]="field"
          />
          } @empty {
          <div class="empty-row">
            <mat-icon class="empty-icon">add_circle_outline</mat-icon>
            <p class="empty-text">Drag and drop form elements here</p>
          </div>
          }
        </div>
      </div>
      }
    </div>
  `,
  styles: `

    .form-row {
      background: white;
      border: 2px dashed #d1d5db;
      border-radius: 12px;
      margin-bottom: 20px;
      transition: all 0.2s ease;
      overflow: hidden;
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
    }

    .form-row:hover {
      border-color: #667eea;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    }

    .row-header {
      padding: 16px 20px;
      background: #f8fafc;
      border-bottom: 1px solid #e5e7eb;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .row-info {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .row-icon {
      color: #6b7280;
      font-size: 20px;
      width: 20px;
      height: 20px;
    }

    .row-label {
      font-weight: 600;
      color: #374151;
      font-size: 14px;
    }

    .delete-row-btn {
      color: #ef4444;
      transition: all 0.2s ease;
    }

    .delete-row-btn:hover:not(:disabled) {
      background: rgba(239, 68, 68, 0.1);
      transform: scale(1.1);
    }

    .delete-row-btn:disabled {
      color: #9ca3af;
    }

    .row-content {
      padding: 20px;
      display: flex;
      gap: 16px;
      flex-wrap: wrap;
      min-height: 80px;
    }

    .field-wrapper {
      flex: 1;
      min-width: 200px;
    }

    .empty-row {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 40px 20px;
      color: #6b7280;
      text-align: center;
    }

    .empty-icon {
      font-size: 48px;
      width: 48px;
      height: 48px;
      color: #d1d5db;
      margin-bottom: 12px;
    }

    .empty-text {
      margin: 0;
      font-size: 14px;
      color: #6b7280;
    }

    @media (max-width: 768px) {
      .form-editor-container {
        padding: 12px;
      }

      .form-row {
        margin-bottom: 16px;
        border-radius: 8px;
      }

      .row-header {
        padding: 12px 16px;
      }

      .row-content {
        padding: 16px;
        gap: 12px;
      }

      .field-wrapper {
        min-width: 150px;
      }
    }
  `,
})
export class FormEditorComponent {
  formService = inject(FormService);
  connectedDropIds() {
    // connect rows with each other and with the static 'field-selector' list
    return ['field-selector', ...this.formService.rows().map((r) => r.id)];
  }
  onDropInRow(event: CdkDragDrop<string>, rowId: string) {
    if (
      event.previousContainer.id === 'field-selector' ||
      event.previousContainer.data === 'field-selector'
    ) {
      const fieldType = event.item.data as FieldTypeDefinition;
      const newField: FormField = {
        id: crypto.randomUUID(),
        type: fieldType.type,
        ...fieldType.defaultConfig,
      };
      this.formService.addField(newField, rowId, event.currentIndex);
      return;
    }
    const dragData = event.item.data as FormField;
    const previousRowId = event.previousContainer.data as string;
    this.formService.moveField(
      dragData.id,
      previousRowId,
      rowId,
      event.currentIndex
    );
  }
}
