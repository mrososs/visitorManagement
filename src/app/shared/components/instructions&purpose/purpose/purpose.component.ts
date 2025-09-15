import { Component, input, output } from '@angular/core';

@Component({
  selector: 'app-purpose-list',
  standalone: false,
  template: `
    <div
      class="bg-card text-card-foreground rounded-lg shadow-sm border border-border border-gray-200"
    >
      <!--header -->
      <div
        class="flex flex-wrap p-4 justify-between items-center gap-4 border-b border-border border-gray-200"
      >
        <h2 class="text-lg font-bold text-foreground">{{ title() }}</h2>
        <p-button
          label="Add"
          (onClick)="add.emit()"
          styleClass="!bg-[#1F36B4] !border-none !text-white hover:!bg-blue-700"
          [icon]="'pi pi-plus'"
        />
      </div>
      <!--filter -->
      <div class="p-4 mt-3">
        <div class="flex flex-wrap justify-between items-center gap-4">
          <div class="flex gap-3">
            <ng-content select="[filters]"></ng-content>
          </div>
          <p-button
            label="Search"
            styleClass="!bg-[#1F36B4] !border-none !text-white hover:!bg-blue-700"
            [icon]="'pi pi-search'"
            (onClick)="search.emit()"
          />
        </div>
      </div>
      <div class="w-full mt-5 ">
        <ng-content select="[table]"></ng-content>
      </div>
    </div>
  `,
  styles: ``,
})
export class PurposeComponent {
  title = input.required<string>();
  add = output<void>();
  search = output<void>();
}
