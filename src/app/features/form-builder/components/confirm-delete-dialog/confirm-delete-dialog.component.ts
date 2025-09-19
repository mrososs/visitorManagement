import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export interface ConfirmDeleteDialogData {
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
}

@Component({
  selector: 'app-confirm-delete-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <div class="confirm-dialog">
      <div class="dialog-header">
        <mat-icon class="warning-icon">warning</mat-icon>
        <h2 mat-dialog-title>{{ data.title }}</h2>
      </div>

      <div mat-dialog-content>
        <p>{{ data.message }}</p>
      </div>

      <div mat-dialog-actions align="end">
        <button mat-button (click)="onCancel()">
          {{ data.cancelText }}
        </button>
        <button mat-raised-button color="warn" (click)="onConfirm()">
          {{ data.confirmText }}
        </button>
      </div>
    </div>
  `,
  styles: [
    `
      .confirm-dialog {
        padding: 0;
      }

      .dialog-header {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-bottom: 16px;
      }

      .warning-icon {
        color: #f44336;
        font-size: 28px;
        width: 28px;
        height: 28px;
      }

      h2 {
        margin: 0;
        color: #333;
        font-size: 20px;
        font-weight: 500;
      }

      p {
        margin: 0;
        color: #666;
        line-height: 1.5;
      }

      mat-dialog-actions {
        margin-top: 24px;
        padding: 0;
      }

      mat-dialog-actions button {
        margin-left: 8px;
      }
    `,
  ],
})
export class ConfirmDeleteDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmDeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ConfirmDeleteDialogData
  ) {}

  onCancel(): void {
    this.dialogRef.close(false);
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }
}
