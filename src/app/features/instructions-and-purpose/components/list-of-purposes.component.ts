import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { Select } from 'primeng/select';
import { FloatLabel } from 'primeng/floatlabel';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { TableModule } from 'primeng/table';
import { PurposeModule } from '../../../shared/components/instructions&purpose/purpose.module';
import {
  DynamicDialogModule,
  DialogService,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { SharedUIModule } from '../../../shared/UI/shared-ui.module';
import { CustomDialogComponent } from '../../../shared/UI/custom-dialog/custom-dialog.component';

@Component({
  selector: 'app-list-of-purposes',
  standalone: true,
  providers: [DialogService],
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    // Removed direct input/select usage in favor of SharedUIModule components
    ToggleSwitchModule,
    TableModule,
    PurposeModule,
    DynamicDialogModule,
    SharedUIModule,
  ],
  template: `
    <div
      class="container mx-auto p-6 border-l-1 min-h-[calc(100vh-64px)] border-l-[#e2e8f0] dark:border-l-[#3f3f46]"
    >
      <app-purpose-list
        [title]="'List of Purposes'"
        (add)="onAddPurpose()"
        (search)="onSearch()"
      >
        <div class="flex flex-wrap gap-3" filters>
          <!-- Purpose Name Filter -->
          <div class="flex flex-col">
            <label
              class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3"
              >Purpose Name</label
            >
            <app-dynamic-floatlabel
              [config]="{
                id: 'purposeName',
                label: 'Input Text',
                placeholder: '',
                styleClass: 'w-64'
              }"
              (onInput)="purposeNameFilter = $event"
            />
          </div>

          <!-- Card Template Filter -->
          <div class="flex flex-col w-100">
            <label
              class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3"
              >Card Template</label
            >
            <app-dynamic-select-floatlabel
              [config]="{
                id: 'cardTemplate',
                label: '',
                options: cardTemplateOptions,
                styleClass: 'w-64'
              }"
              (onChange)="cardTemplateFilter = $event?.value"
            />
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
  private dialogService = inject(DialogService);
  private dialogRef: DynamicDialogRef | undefined;
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
    this.dialogRef = this.dialogService.open(CustomDialogComponent, {
      header: 'Add New Purpose',
      width: '520px',
      modal: true,
      dismissableMask: true,
      closable: true,
      styleClass: 'rounded-2xl overflow-visible',
      contentStyle: { overflow: 'visible' },
      data: {
        submitLabel: 'Submit',
        cancelLabel: 'Cancel',
        fields: [
          {
            key: 'name',
            label: 'Purpose Name',
            type: 'text',
            required: true,
            placeholder: 'Input Text',
          },
          {
            key: 'template',
            label: 'Select Card Template',
            type: 'select',
            required: true,
            options: this.cardTemplateOptions,
          },
        ],
        initialValue: {},
      },
    });

    this.dialogRef.onClose.subscribe((result) => {
      if (result?.saved) {
        // TODO: handle saving new purpose
      }
    });
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
