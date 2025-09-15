import { Component, input, output } from '@angular/core';
import { TableConfig, TableColumn } from '../../interfaces/ui-interfaces';

@Component({
  selector: 'app-dynamic-table',
  standalone: false,
  template: `
    <div class="w-full">
      <p-table
        [value]="data()"
        [class]="config().styleClass || 'custom-table border-none'"
        [paginator]="config().paginator"
        [rows]="config().rows || 10"
        [totalRecords]="config().totalRecords || 0"
      >
        <ng-template pTemplate="header">
          <tr>
            <th *ngIf="config().showRowNumbers" style="width: 60px"></th>
            <th
              *ngFor="let col of config().columns"
              [style.width]="col.width"
              [pSortableColumn]="col.sortable ? col.field : undefined"
            >
              {{ col.header }}
              <p-sortIcon *ngIf="col.sortable" [field]="col.field"></p-sortIcon>
            </th>
            <th *ngIf="config().showActions" style="width: 120px">Actions</th>
          </tr>
        </ng-template>
        <ng-template pTemplate="body" let-item let-rowIndex="rowIndex">
          <tr>
            <td *ngIf="config().showRowNumbers">{{ rowIndex + 1 }}</td>
            <td *ngFor="let col of config().columns">
              <ng-container [ngSwitch]="col.type">
                <!-- Text/Number/Date -->
                <span *ngSwitchCase="'text'">
                  {{ getFieldValue(item, col.field) }}
                </span>
                <span *ngSwitchCase="'number'">
                  {{ getFieldValue(item, col.field) }}
                </span>
                <span *ngSwitchCase="'date'">
                  {{ getFieldValue(item, col.field) }}
                </span>

                <!-- Boolean (Toggle Switch) -->
                <p-toggleSwitch
                  *ngSwitchCase="'boolean'"
                  [ngModel]="getFieldValue(item, col.field)"
                  (onChange)="onToggleChange.emit({item, field: col.field, value: !getFieldValue(item, col.field)})"
                />

                <!-- Custom Template -->
                <ng-container *ngSwitchCase="'custom'">
                  <ng-container [ngSwitch]="col.customTemplate">
                    <!-- Card Template -->
                    <div
                      *ngSwitchCase="'card-template'"
                      class="flex items-center gap-3"
                    >
                      <div
                        class="card-template"
                        [ngClass]="
                          'template' +
                          (getFieldValue(item, col.field) === 'Template1'
                            ? '1'
                            : '2')
                        "
                      >
                        {{ getFieldValue(item, col.field) }}
                      </div>
                    </div>
                    <!-- Default custom -->
                    <span *ngSwitchDefault>{{
                      getFieldValue(item, col.field)
                    }}</span>
                  </ng-container>
                </ng-container>

                <!-- Default -->
                <span *ngSwitchDefault>{{
                  getFieldValue(item, col.field)
                }}</span>
              </ng-container>
            </td>
            <td *ngIf="config().showActions">
              <div class="flex gap-3 justify-end">
                <!-- View Action -->
                <p-button
                  *ngIf="config().actions?.view"
                  icon="pi pi-eye"
                  [text]="true"
                  [rounded]="true"
                  size="small"
                  (onClick)="onView.emit(item)"
                  styleClass="text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                />

                <!-- Edit Action -->
                <p-button
                  *ngIf="config().actions?.edit"
                  icon="pi pi-pencil"
                  [text]="true"
                  [rounded]="true"
                  size="small"
                  (onClick)="onEdit.emit(item)"
                  styleClass="text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                />

                <!-- Delete Action -->
                <p-button
                  *ngIf="config().actions?.delete"
                  icon="pi pi-trash"
                  [text]="true"
                  [rounded]="true"
                  size="small"
                  (onClick)="onDelete.emit(item)"
                  styleClass="text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                />

                <!-- Custom Actions -->
                <p-button
                  *ngFor="let action of config().actions?.custom"
                  [icon]="action.icon"
                  [label]="action.label"
                  [text]="true"
                  [rounded]="true"
                  size="small"
                  [styleClass]="
                    action.styleClass ||
                    'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                  "
                  (onClick)="onCustomAction.emit({item, action: action.action})"
                />
              </div>
            </td>
          </tr>
        </ng-template>
      </p-table>
    </div>
  `,
  styles: ``,
})
export class DynamicTableComponent {
  data = input.required<any[]>();
  config = input.required<TableConfig>();

  onView = output<any>();
  onEdit = output<any>();
  onDelete = output<any>();
  onToggleChange = output<{ item: any; field: string; value: any }>();
  onCustomAction = output<{ item: any; action: string }>();

  getFieldValue(item: any, field: string): any {
    return field.split('.').reduce((obj, key) => obj?.[key], item);
  }
}
