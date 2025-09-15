import { Component, input, output } from '@angular/core';
import {
  FloatLabelConfig,
  SelectFloatLabelConfig,
} from '../interfaces/ui-interfaces';

@Component({
  selector: 'app-dynamic-floatlabel',
  standalone: false,
  template: `
    <p-floatlabel [ngClass]="config().styleClass">
      <input
        pInputText
        [id]="config().id"
        [type]="config().type || 'text'"
        [placeholder]="config().placeholder"
        [disabled]="config().disabled"
        [readonly]="config().readonly"
        [required]="config().required"
        [autocomplete]="config().autocomplete"
        (input)="onInput.emit($event)"
        (blur)="onBlur.emit($event)"
        (focus)="onFocus.emit($event)"
      />
      <label [for]="config().id">{{ config().label }}</label>
    </p-floatlabel>
  `,
  styles: ``,
})
export class DynamicFloatLabelComponent {
  config = input.required<FloatLabelConfig>();
  onInput = output<Event>();
  onBlur = output<Event>();
  onFocus = output<Event>();
}

@Component({
  selector: 'app-dynamic-select-floatlabel',
  standalone: false,
  template: `
    <p-floatlabel [ngClass]="config().styleClass">
      <p-select
        [id]="config().id"
        [options]="config().options"
        [optionLabel]="config().optionLabel || 'label'"
        [optionValue]="config().optionValue || 'value'"
        [styleClass]="config().styleClass"
        [disabled]="config().disabled"
        [placeholder]="config().placeholder"
        (onChange)="onChange.emit($event)"
        (onFocus)="onFocus.emit($event)"
        (onBlur)="onBlur.emit($event)"
      />
      <label [for]="config().id">{{ config().label }}</label>
    </p-floatlabel>
  `,
  styles: ``,
})
export class DynamicSelectFloatLabelComponent {
  config = input.required<SelectFloatLabelConfig>();
  onChange = output<any>();
  onFocus = output<Event>();
  onBlur = output<Event>();
}
