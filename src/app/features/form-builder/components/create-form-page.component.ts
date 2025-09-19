import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormElementsMenuComponent } from './form-elements-menu/form-elements-menu.component';
import { MainCanvasComponent } from './main-canvas/main-canvas.component';
// FieldSettingsComponent is opened via MatDialog; no need to import here

@Component({
  selector: 'app-create-form-page',
  standalone: true,
  imports: [CommonModule, FormElementsMenuComponent, MainCanvasComponent],
  styleUrls: ['../style/formbuilder.css'],
  template: `
    <div class="form-builder-container">
      <div class="sidebar-left elements-menu-container">
        <app-form-elements-menu />
      </div>
      <div class="main-content">
        <app-main-canvas />
      </div>
      <!-- <div class="sidebar-right field-settings-container">
        <app-field-settings />
      </div> -->
    </div>
  `,
})
export class CreateFormPageComponent {}
