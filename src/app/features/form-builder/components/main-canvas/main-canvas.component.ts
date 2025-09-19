import {
  Component,
  inject,
  signal,
  input,
  output,
  effect,
} from '@angular/core';
import { FormEditorComponent } from './form-editor/form-editor.component';
import { CommonModule } from '@angular/common';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { FormPreviewComponent } from './form-preview/form-preview.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { FormService } from '../../services/form.service';
import { FormExportComponent } from '../form-export/form-export.component';
import { DeviceFrameComponent } from '../device-frame/device-frame.component';

@Component({
  selector: 'app-main-canvas',
  imports: [
    FormEditorComponent,
    CommonModule,
    MatButtonToggleModule,
    FormPreviewComponent,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    DeviceFrameComponent,
  ],
  template: `
    <div class="main-canvas-container">
      <div class="canvas-header">
        <div class="header-content">
          <h3 class="canvas-title">
            <mat-icon class="title-icon">edit</mat-icon>
            Form Canvas
          </h3>
        </div>
        <mat-button-toggle-group
          [(value)]="activeTab"
          hideSingleSelectionIndicator="true"
          class="tab-group"
        >
          <mat-button-toggle value="editor">
            <mat-icon>build</mat-icon>
            Editor
          </mat-button-toggle>
          <mat-button-toggle value="preview">
            <mat-icon>visibility</mat-icon>
            Preview
          </mat-button-toggle>
        </mat-button-toggle-group>
        @if(activeTab()==='editor'){
        <div class="header-actions">
          <button
            mat-raised-button
            color="primary"
            (click)="formService.addRow()"
            class="add-row-btn"
          >
            <mat-icon>add_circle</mat-icon>
            Add Row
          </button>
          <button
            *ngIf="formService.getFormFields().length > 0"
            mat-stroked-button
            color="warn"
            class="export-btn"
            (click)="openExportDialog()"
          >
            <mat-icon>ios_share</mat-icon>
            Export
          </button>
        </div>
        }
      </div>
      <div class="canvas-content">
        <div class="canvas-surface">
          @if (activeTab()==='editor') {
          <app-form-editor />
          }@else {
          <!-- Device toggle shown only in preview mode -->
          <div class="device-toggle">
            <mat-button-toggle-group
              [(value)]="deviceMode"
              hideSingleSelectionIndicator="true"
              class="device-group"
            >
              <mat-button-toggle value="desktop">
                <mat-icon>desktop_windows</mat-icon>
                Desktop
              </mat-button-toggle>
              <mat-button-toggle value="mobile">
                <mat-icon>smartphone</mat-icon>
                Mobile
              </mat-button-toggle>
            </mat-button-toggle-group>
          </div>

          <div
            class="preview-wrapper"
            [class.mobile]="deviceMode() === 'mobile'"
          >
            @if (deviceMode() === 'mobile') {
            <app-device-frame preset="iphone13">
              <app-form-preview />
            </app-device-frame>
            } @else {
            <app-form-preview />
            }
          </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: `
    .main-canvas-container {
      display: flex;
      flex-direction: column;
      height: 100%;
      min-height: 0;
      background: #f8fafc;
    }

    .canvas-header {
      padding: 12px 16px;
      border-bottom: 1px solid #e5e7eb;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-shrink: 0;
      box-shadow: 0 2px 10px rgba(0,0,0,0.08);
    }

    .header-content {
      display: flex;
      align-items: center;
      gap: 24px;
    }

    .canvas-title {
      font-size: 20px;
      font-weight: 600;
      margin: 0;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .title-icon {
      font-size: 24px;
      width: 24px;
      height: 24px;
    }

    .tab-group {
      background: rgba(255, 255, 255, 0.12);
      border-radius: 8px;
      padding: 4px;
    }

    .tab-group ::ng-deep .mat-button-toggle {
      color: rgba(255, 255, 255, 0.9);
      border: none;
      background: transparent;
      border-radius: 6px;
      transition: all 0.2s ease;
      min-width: 110px;
      min-height: 36px;
    }

    .tab-group ::ng-deep .mat-button-toggle.mat-button-toggle-checked {
      background: rgba(255, 255, 255, 0.25);
      color: white;
    }

    .tab-group ::ng-deep .mat-button-toggle-label-content {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 6px 14px;
      line-height: 1;
      font-size: 14px;
    }

    .header-actions {
      display: flex;
      gap: 12px;
    }

    .add-row-btn {
      background: rgba(255, 255, 255, 0.2);
      color: white;
      border: 1px solid rgba(255, 255, 255, 0.3);
      transition: all 0.2s ease;
    }

    .add-row-btn:hover {
      background: rgba(255, 255, 255, 0.3);
      transform: translateY(-1px);
    }

    .export-btn {
      background: rgba(255, 255, 255, 0.2);
      color: white;
      border: 1px solid rgba(255, 255, 255, 0.3);
      transition: all 0.2s ease;
    }

    .export-btn:hover {
      background: rgba(255, 255, 255, 0.3);
      transform: translateY(-1px);
    }

    .canvas-content {
      flex: 1;
      min-height: 0;
      overflow: auto;
      padding: 24px;
      background: linear-gradient(180deg, #f8fafc 0%, #ffffff 100%);
    }

    .canvas-surface {
      max-width: 1200px;
      margin: 0 auto;
      padding: 8px;
    }

    .device-toggle {
      display: flex;
      justify-content: center;
      margin-bottom: 24px;
      padding: 16px;
      background: #f8fafc;
      border-radius: 8px;
      border: 1px solid #e5e7eb;
    }

    .device-group {
      background: rgba(99, 102, 241, 0.1);
      border-radius: 8px;
      padding: 4px;
    }

    .device-group ::ng-deep .mat-button-toggle {
      color: #6b7280;
      border: none;
      background: transparent;
      border-radius: 6px;
      transition: all 0.2s ease;
      min-width: 120px;
      min-height: 40px;
    }

    .device-group ::ng-deep .mat-button-toggle.mat-button-toggle-checked {
      background: #6366f1;
      color: white;
    }

    .device-group ::ng-deep .mat-button-toggle-label-content {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 16px;
      line-height: 1;
      font-size: 14px;
      font-weight: 500;
    }

    .preview-wrapper {
    
      min-height: 0;
    }

    .preview-wrapper.mobile {
      padding: 20px;
      align-items: center;
    }

    .preview-wrapper.mobile app-device-frame {
      max-width: 100%;
      max-height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    @media (max-width: 768px) {
      .canvas-header {
        padding: 16px 20px;
        flex-direction: column;
        gap: 16px;
        align-items: stretch;
      }

      .header-content {
        justify-content: space-between;
      }

      .canvas-title {
        font-size: 20px;
      }

      .title-icon {
        font-size: 24px;
        width: 24px;
        height: 24px;
      }

      .canvas-content { padding: 16px; }
      .canvas-surface { padding: 4px; }
    }
  `,
})
export class MainCanvasComponent {
  activeTab = signal<'preview' | 'editor'>('editor');
  deviceMode = signal<'desktop' | 'mobile'>('desktop');
  formService = inject(FormService);
  private dialog = inject(MatDialog);

  // Input to control export button visibility - defaults to true for backward compatibility
  showExportButton = input<boolean>(true);

  // Output to communicate preview mode state to parent
  previewModeChanged = output<boolean>();

  constructor() {
    // Effect to emit preview mode changes
    effect(() => {
      this.previewModeChanged.emit(this.activeTab() === 'preview');
    });
  }

  openExportDialog(): void {
    const fields = this.formService.getFormFields();
    if (fields.length === 0) {
      alert('Please add some fields to the form before exporting.');
      return;
    }

    const dialogRef = this.dialog.open(FormExportComponent, {
      width: '800px',
      maxWidth: '90vw',
      maxHeight: '80vh',
      data: { fields },
    });
  }
}
