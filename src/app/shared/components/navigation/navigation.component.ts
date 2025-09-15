import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonModule],
  template: `
    <nav class="bg-white shadow-sm border-b border-gray-200 p-4">
      <div class="container mx-auto flex gap-4">
        <p-button
          label="List of Purposes"
          [routerLink]="['/list-of-purposes']"
          styleClass="!bg-[#1F36B4] !border-none !text-white hover:!bg-blue-700"
          [text]="true"
        />
        <p-button
          label="List of Special Requirements"
          [routerLink]="['/list-of-special-requirements']"
          styleClass="!bg-[#1F36B4] !border-none !text-white hover:!bg-blue-700"
          [text]="true"
        />
        <p-button
          label="List of Entry Instructions"
          [routerLink]="['/list-of-entry-instructions']"
          styleClass="!bg-[#1F36B4] !border-none !text-white hover:!bg-blue-700"
          [text]="true"
        />
        <p-button
          label="List of Instructions to Submit Permit"
          [routerLink]="['/list-of-instructions-to-submit-permit']"
          styleClass="!bg-[#1F36B4] !border-none !text-white hover:!bg-blue-700"
          [text]="true"
        />
      </div>
    </nav>
  `,
  styles: [
    `
      p-button[text='true'] {
        background: transparent !important;
        color: #1f36b4 !important;
        border: 1px solid #1f36b4 !important;
      }

      p-button[text='true']:hover {
        background: #1f36b4 !important;
        color: white !important;
      }
    `,
  ],
})
export class NavigationComponent {}
