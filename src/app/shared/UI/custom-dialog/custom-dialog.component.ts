import { Component, inject } from '@angular/core';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ButtonConfig } from '../interfaces/ui-interfaces';

@Component({
  selector: 'app-custom-dialog',
  standalone: false,
  providers: [DialogService],
  template: `
    <div class="p-4 space-y-4">
      <div class="flex justify-between items-center gap-2">
        <label class="text-sm">Purpose name</label>
      </div>

      <div class="flex justify-between gap-2 pt-2">
        <p-button
          styleClass="!bg-transparent !border-black !text-black hover:!bg-[#1F36B4] hover:!text-white w-full md:w-56"
          label="close"
          (onClick)="close()"
        ></p-button>
        <p-button
          styleClass="!bg-[#1F36B4] !border-none !text-white hover:!bg-blue-700 w-full md:w-56"
          label="Save"
          (onClick)="save()"
        ></p-button>
      </div>
    </div>
  `,
  styles: ``,
})
export class CustomDialogComponent {
  dialogService = inject(DialogService);
  ref: DynamicDialogRef | undefined = undefined;
  closeButtonConfig: ButtonConfig = {
    label: 'Close',
    severity: 'secondary',
    rounded: true,
    text: true,
    icon: 'pi pi-times',
    styleClass: 'w-full md:w-56',
  };

  close() {
    this.ref!.close();
  }

  save() {
    this.ref!.close({ saved: true });
  }
}
