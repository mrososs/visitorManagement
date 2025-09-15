import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FloatLabel } from 'primeng/floatlabel';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { TableModule } from 'primeng/table';
import { PurposeModule } from '../../../shared/components/instructions&purpose/purpose.module';

@Component({
  selector: 'app-list-of-special-requirements',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    FloatLabel,
    ToggleSwitchModule,
    TableModule,
    PurposeModule,
  ],
  template: `
    <div class="container mx-auto p-6">
      <app-purpose-list
        [title]="'List of Special Requirement'"
        (add)="onAddSpecialRequirement()"
        (search)="onSearch()"
      >
        <div class="flex gap-3" filters>
          <!-- Special Requirement Name Filter -->
          <div class="flex flex-col">
            <label class="text-sm font-medium text-gray-700 mb-1"
              >Special Requirement Name</label
            >
            <p-floatLabel>
              <input
                pInputText
                id="specialRequirementName"
                [(ngModel)]="specialRequirementNameFilter"
                class="w-64"
              />
              <label for="specialRequirementName">Input Text</label>
            </p-floatLabel>
          </div>
        </div>

        <div table>
          <p-table
            [value]="specialRequirements"
            class="custom-table border-none"
            [paginator]="false"
          >
            <ng-template pTemplate="header">
              <tr>
                <th style="width: 60px">#</th>
                <th>Name</th>
                <th>Status</th>
                <th style="width: 120px">Actions</th>
              </tr>
            </ng-template>
            <ng-template
              pTemplate="body"
              let-requirement
              let-rowIndex="rowIndex"
            >
              <tr>
                <td>{{ rowIndex + 1 }}</td>
                <td>{{ requirement.name }}</td>
                <td>
                  <p-toggleSwitch
                    [(ngModel)]="requirement.status"
                    (onChange)="onStatusToggle(requirement)"
                  />
                </td>
                <td>
                  <div class="flex gap-3 justify-end">
                    <p-button
                      icon="pi pi-pencil"
                      [text]="true"
                      [rounded]="true"
                      size="small"
                      (onClick)="onEdit(requirement)"
                      styleClass="text-gray-600 hover:bg-gray-100"
                    />
                    <p-button
                      icon="pi pi-trash"
                      [text]="true"
                      [rounded]="true"
                      size="small"
                      (onClick)="onDelete(requirement)"
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
export class ListOfSpecialRequirementsComponent {
  specialRequirementNameFilter = '';

  specialRequirements = [
    {
      id: 1,
      name: 'SP 1',
      status: true,
    },
    {
      id: 2,
      name: 'SP 2',
      status: true,
    },
  ];

  onAddSpecialRequirement() {
    console.log('Add Special Requirement clicked');
  }

  onSearch() {
    console.log('Search clicked', {
      specialRequirementName: this.specialRequirementNameFilter,
    });
  }

  onEdit(requirement: any) {
    console.log('Edit Special Requirement:', requirement);
  }

  onDelete(requirement: any) {
    console.log('Delete Special Requirement:', requirement);
  }

  onStatusToggle(requirement: any) {
    console.log('Status toggled for:', requirement);
  }
}
