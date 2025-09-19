import { Component, input } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormField } from '../../../models/field';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-file-field',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    CommonModule,
  ],
  template: `
    <div class="file-field-container">
      <label class="file-label">{{ field().label }}</label>
      <div class="file-input-wrapper">
        <input
          type="file"
          [required]="field().required"
          [accept]="field().accept || '*'"
          class="file-input"
          #fileInput
          (change)="onFileSelected($event)"
        />
        <button
          mat-stroked-button
          type="button"
          (click)="fileInput.click()"
          class="file-button"
        >
          <mat-icon>upload_file</mat-icon>
          Choose File
        </button>
        <span class="file-name" *ngIf="selectedFileName">{{
          selectedFileName
        }}</span>
      </div>
    </div>
  `,
  styles: `
    .file-field-container {
      padding: 16px;
      border: 1px solid #e0e0e0;
      border-radius: 4px;
      background-color: #fafafa;
    }
    
    .file-label {
      display: block;
      margin-bottom: 12px;
      font-weight: 500;
      color: rgba(0, 0, 0, 0.87);
    }
    
    .file-input-wrapper {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    
    .file-input {
      display: none;
    }
    
    .file-button {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .file-name {
      color: #666;
      font-size: 14px;
    }
  `,
})
export class FileFieldComponent {
  field = input.required<FormField>();
  selectedFileName: string = '';

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFileName = file.name;
    }
  }
}
