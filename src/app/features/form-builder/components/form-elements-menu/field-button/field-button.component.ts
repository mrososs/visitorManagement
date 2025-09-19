import { Component, input, Input, signal } from '@angular/core';
import { FieldTypeDefinition } from '../../../models/field';
import { MatIconModule } from '@angular/material/icon';
import { DragDropModule } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-field-button',
  imports: [MatIconModule, DragDropModule],
  template: `
    <button
      cdkDrag
      [cdkDragData]="field()"
      (cdkDragStarted)="whileDragging.set(true)"
      (cdkDragEnded)="whileDragging.set(false)"
      class="w-full p-3 mb-2 border border-gray-200 hover:border-black hover:shadow-sm transition-shadow rounded-lg flex items-center gap-3 cursor-pointer"
    >
      <div class="rounded-md bg-gray-100 flex items-center justify-center p-1">
        <i class="pi pi-{{ field().icon }} text-gray-600"></i>
      </div>
      <span>{{ field().label }}</span>
      <div *cdkDragPlaceholder></div>
    </button>
    @if(whileDragging()){
    <button
      cdkDrag
      [cdkDragData]="field()"
      (cdkDragStarted)="whileDragging.set(true)"
      (cdkDragEnded)="whileDragging.set(false)"
      class="w-full p-3 mb-2 border border-gray-100 hover:border-black hover:shadow-sm transition-shadow rounded-lg flex items-center gap-3 cursor-pointer"
    >
      <div class="rounded-md bg-gray-100 flex items-center justify-center p-1">
        <i class="pi pi-{{ field().icon }} text-gray-600"></i>
      </div>
      <span>{{ field().label }}</span>
      <div *cdkDragPlaceholder></div>
    </button>
    }
  `,
  styles: ``,
})
export class FieldButtonComponent {
  field = input.required<FieldTypeDefinition>();
  whileDragging = signal(false);
}
