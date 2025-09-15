import { Component, input, output } from '@angular/core';
import { ButtonConfig } from '../interfaces/ui-interfaces';

@Component({
  selector: 'app-dynamic-button',
  standalone: false,
  template: `
    <p-button
      [label]="config().label"
      [icon]="config().icon"
      [severity]="config().severity"
      [size]="config().size"
      [text]="config().text"
      [rounded]="config().rounded"
      [outlined]="config().outlined"
      [raised]="config().raised"
      [styleClass]="config().styleClass"
      [disabled]="config().disabled"
      (onClick)="onClick.emit($event)"
    />
  `,
  styles: ``,
})
export class DynamicButtonComponent {
  config = input.required<ButtonConfig>();
  onClick = output<any>();
}
