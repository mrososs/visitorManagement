import { Component, inject } from '@angular/core';
import {
  DialogService,
  DynamicDialogRef,
  DynamicDialogConfig,
} from 'primeng/dynamicdialog';
import {
  ButtonConfig,
  DynamicDialogData,
  DynamicFormField,
} from '../interfaces/ui-interfaces';

@Component({
  selector: 'app-custom-dialog',
  standalone: false,
  providers: [DialogService],
  template: `
    <div class="p-6 space-y-5">
      @if (data?.header) {
      <h3 class="text-base font-semibold text-gray-900">{{ data?.header }}</h3>
      }

      <form class="space-y-4" (ngSubmit)="save()">
        @for (field of data?.fields ?? []; track field.key) { @if (field.type
        === 'text') {
        <div class="space-y-1">
          <label
            class="text-sm font-medium text-gray-700 dark:text-gray-300"
            [attr.for]="field.key"
          >
            {{ field.label }}
            @if (field.required) { <span class="text-red-500">*</span> }
          </label>
          <input
            pInputText
            class="w-full"
            [id]="field.key"
            [placeholder]="field.placeholder || ''"
            [(ngModel)]="model[field.key]"
            [name]="field.key"
          />
        </div>
        } @if (field.type === 'select') {
        <div class="space-y-1">
          <label
            class="text-sm font-medium text-gray-700 dark:text-gray-300"
            [attr.for]="field.key"
          >
            {{ field.label }}
            @if (field.required) { <span class="text-red-500">*</span> }
          </label>
          <p-select
            class="w-full"
            [options]="field.options"
            [ngModel]="model[field.key]"
            (ngModelChange)="model[field.key] = $event"
            [name]="field.key"
          ></p-select>
        </div>
        } }

        <div class="flex justify-center  gap-3 pt-2">
          <p-button
            [label]="data?.cancelLabel || 'Cancel'"
            styleClass="!bg-transparent !border-gray-300 !text-gray-900 hover:!bg-gray-100 w-full md:w-50 dark:!text-gray-300"
            (onClick)="close()"
          />
          <p-button
            [label]="data?.submitLabel || 'Submit'"
            [disabled]="!isValid()"
            styleClass="!bg-[#1F36B4] !border-none !text-white hover:!bg-blue-700 disabled:!bg-gray-300 disabled:!text-gray-500 w-full md:w-56"
            (onClick)="save()"
          />
        </div>
      </form>
    </div>
  `,
  styles: ``,
})
export class CustomDialogComponent {
  dialogService = inject(DialogService);
  ref: DynamicDialogRef | null = inject(DynamicDialogRef, {
    optional: true,
  }) as DynamicDialogRef | null;
  private config = inject(DynamicDialogConfig, { optional: true });
  data: DynamicDialogData | undefined =
    (this.config?.data as DynamicDialogData) || undefined;
  model: Record<string, any> = { ...(this.data?.initialValue || {}) };
  closeButtonConfig: ButtonConfig = {
    label: 'Close',
    severity: 'secondary',
    rounded: true,
    text: true,
    icon: 'pi pi-times',
    styleClass: 'w-full md:w-56',
  };

  close() {
    this.ref?.close();
  }

  save() {
    this.ref?.close({ saved: true, value: this.model });
  }

  isValid(): boolean {
    if (!this.data?.fields) {
      return false;
    }
    for (const field of this.data.fields) {
      if (field.required) {
        const value = this.model[field.key];
        if (value === undefined || value === null || value === '') {
          return false;
        }
      }
    }
    return true;
  }
}
