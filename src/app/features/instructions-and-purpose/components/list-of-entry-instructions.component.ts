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
  selector: 'app-list-of-entry-instructions',
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
        [title]="'List of Entry Instruction'"
        (add)="onAddEntryInstruction()"
        (search)="onSearch()"
      >
        <div class="flex gap-3" filters>
          <!-- Instruction Name Filter -->
          <div class="flex flex-col">
            <label class="text-sm font-medium text-gray-700 mb-1"
              >Instruction Name</label
            >
            <p-floatLabel>
              <input
                pInputText
                id="instructionName"
                [(ngModel)]="instructionNameFilter"
                class="w-64"
              />
              <label for="instructionName">Input Text</label>
            </p-floatLabel>
          </div>
        </div>

        <div table>
          <p-table
            [value]="entryInstructions"
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
              let-instruction
              let-rowIndex="rowIndex"
            >
              <tr>
                <td>{{ rowIndex + 1 }}</td>
                <td>{{ instruction.name }}</td>
                <td>
                  <p-toggleSwitch
                    [(ngModel)]="instruction.status"
                    (onChange)="onStatusToggle(instruction)"
                  />
                </td>
                <td>
                  <div class="flex gap-3 justify-end">
                    <p-button
                      icon="pi pi-pencil"
                      [text]="true"
                      [rounded]="true"
                      size="small"
                      (onClick)="onEdit(instruction)"
                      styleClass="text-gray-600 hover:bg-gray-100"
                    />
                    <p-button
                      icon="pi pi-trash"
                      [text]="true"
                      [rounded]="true"
                      size="small"
                      (onClick)="onDelete(instruction)"
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
export class ListOfEntryInstructionsComponent {
  instructionNameFilter = '';

  entryInstructions = [
    {
      id: 1,
      name: 'Ins 1',
      status: true,
    },
    {
      id: 2,
      name: 'Inst 2',
      status: true,
    },
  ];

  onAddEntryInstruction() {
    console.log('Add Entry Instruction clicked');
  }

  onSearch() {
    console.log('Search clicked', {
      instructionName: this.instructionNameFilter,
    });
  }

  onEdit(instruction: any) {
    console.log('Edit Entry Instruction:', instruction);
  }

  onDelete(instruction: any) {
    console.log('Delete Entry Instruction:', instruction);
  }

  onStatusToggle(instruction: any) {
    console.log('Status toggled for:', instruction);
  }
}
