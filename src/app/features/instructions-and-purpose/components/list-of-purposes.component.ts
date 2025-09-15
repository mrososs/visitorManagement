import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { FloatLabel } from 'primeng/floatlabel';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { TableModule } from 'primeng/table';
import { PurposeModule } from '../../../shared/components/instructions&purpose/purpose.module';

@Component({
  selector: 'app-list-of-purposes',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    Select,
    FloatLabel,
    ToggleSwitchModule,
    TableModule,
    PurposeModule,
  ],
  template: `
    <div class="container mx-auto p-6">
      <app-purpose-list
        [title]="'List of Purposes'"
        (add)="onAddPurpose()"
        (search)="onSearch()"
      >
        <div class="flex gap-3" filters>
          <!-- Purpose Name Filter -->
          <div class="flex flex-col">
            <label class="text-sm font-medium text-gray-700 mb-1"
              >Purpose Name</label
            >
            <p-floatLabel>
              <input
                pInputText
                id="purposeName"
                [(ngModel)]="purposeNameFilter"
                class="w-64"
              />
              <label for="purposeName">Input Text</label>
            </p-floatLabel>
          </div>

          <!-- Card Template Filter -->
          <div class="flex flex-col">
            <label class="text-sm font-medium text-gray-700 mb-1"
              >Card Template</label
            >
            <p-floatLabel>
              <p-select
                id="cardTemplate"
                [(ngModel)]="cardTemplateFilter"
                [options]="cardTemplateOptions"
                class="w-48"
              />
              <label for="cardTemplate">All</label>
            </p-floatLabel>
          </div>
        </div>

        <div table>
          <p-table
            [value]="purposes"
            class="custom-table border-none"
            [paginator]="false"
          >
            <ng-template pTemplate="header">
              <tr>
                <th style="width: 60px">#</th>
                <th>Purpose Name</th>
                <th>Assigned Card Template</th>
                <th>Status</th>
                <th style="width: 120px">Actions</th>
              </tr>
            </ng-template>
            <ng-template pTemplate="body" let-purpose let-rowIndex="rowIndex">
              <tr>
                <td>{{ rowIndex + 1 }}</td>
                <td>{{ purpose.name }}</td>
                <td>
                  <div class="flex items-center gap-3">
                    <div
                      class="card-template"
                      [ngClass]="
                        purpose.template === 'Template1'
                          ? 'template1'
                          : 'template2'
                      "
                    >
                      {{ purpose.template }}
                    </div>
                  </div>
                </td>
                <td>
                  <p-toggleSwitch
                    [(ngModel)]="purpose.status"
                    (onChange)="onStatusToggle(purpose)"
                  />
                </td>
                <td>
                  <div class="flex gap-3 justify-end">
                    <p-button
                      icon="pi pi-eye"
                      [text]="true"
                      [rounded]="true"
                      size="small"
                      (onClick)="onView(purpose)"
                      styleClass="text-gray-600 hover:bg-gray-100"
                    />
                    <p-button
                      icon="pi pi-pencil"
                      [text]="true"
                      [rounded]="true"
                      size="small"
                      (onClick)="onEdit(purpose)"
                      styleClass="text-gray-600 hover:bg-gray-100"
                    />
                    <p-button
                      icon="pi pi-trash"
                      [text]="true"
                      [rounded]="true"
                      size="small"
                      (onClick)="onDelete(purpose)"
                      styleClass="text-gray-600 hover:bg-gray-100"
                    />
                  </div>
                </td>
              </tr>
            </ng-template>
          </p-table>
        </div>
      </app-purpose-list>
    </div>
  `,
  styles: [
    `
      .card-template {
        width: 60px;
        height: 40px;
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        font-weight: 500;
        color: white;
      }

      .template1 {
        background: linear-gradient(135deg, #87ceeb, #4682b4);
      }

      .template2 {
        background: linear-gradient(135deg, #4169e1, #1e3a8a);
      }

      .custom-table {
        border: none !important;
      }

      .custom-table .p-datatable-header {
        background: #f8f9fa;
        border-bottom: 1px solid #e5e7eb;
      }

      .custom-table .p-datatable-tbody > tr {
        border-bottom: 1px solid #f3f4f6;
      }

      .custom-table .p-datatable-tbody > tr:hover {
        background: #f9fafb;
      }
    `,
  ],
})
export class ListOfPurposesComponent {
  purposeNameFilter = '';
  cardTemplateFilter = '';

  cardTemplateOptions = [
    { label: 'All', value: 'All' },
    { label: 'Template1', value: 'Template1' },
    { label: 'Template2', value: 'Template2' },
  ];

  purposes = [
    {
      id: 1,
      name: 'Purpose 1',
      template: 'Template1',
      status: true,
    },
    {
      id: 2,
      name: 'Purpose 2',
      template: 'Template2',
      status: true,
    },
  ];

  onAddPurpose() {
    console.log('Add Purpose clicked');
  }

  onSearch() {
    console.log('Search clicked', {
      purposeName: this.purposeNameFilter,
      cardTemplate: this.cardTemplateFilter,
    });
  }

  onView(purpose: any) {
    console.log('View Purpose:', purpose);
  }

  onEdit(purpose: any) {
    console.log('Edit Purpose:', purpose);
  }

  onDelete(purpose: any) {
    console.log('Delete Purpose:', purpose);
  }

  onStatusToggle(purpose: any) {
    console.log('Status toggled for:', purpose);
  }
}
