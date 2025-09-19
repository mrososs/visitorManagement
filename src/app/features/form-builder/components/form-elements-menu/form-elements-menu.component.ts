import { Component, computed, inject } from '@angular/core';
import { FieldTypesService } from '../../services/field-types.service';
import { FieldButtonComponent } from './field-button/field-button.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { FormService } from '../../services/form.service';
@Component({
  selector: 'app-form-elements-menu',
  imports: [FieldButtonComponent, DragDropModule, CommonModule],
  template: `
    <div class="h-full flex flex-col">
      <h3 class="px-4 pt-4 pb-2 text-sm font-semibold text-gray-700">
        Form Elements
      </h3>
      <div
        class="flex-1 overflow-y-auto px-3 pb-4 space-y-2"
        cdkDropList
        cdkDropListSortingDisabled="true"
        [cdkDropListData]="'field-selector'"
        id="field-selector"
        [cdkDropListConnectedTo]="connectedRows()"
      >
        @for (type of fieldTypes; track type.type) {
        <app-field-button [field]="type" />
        }
      </div>
    </div>
  `,
  styles: ``,
})
export class FormElementsMenuComponent {
  fieldTypesService = inject(FieldTypesService);
  fieldTypes = this.fieldTypesService.getFieldTypes();
  formService = inject(FormService);

  connectedRows = computed(() => this.formService.rows().map((r) => r.id));
}
