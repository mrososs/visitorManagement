// device-frame.component.ts (standalone)
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-device-frame',
  standalone: true,
  template: `
    <div
      class="device"
      [style.width.px]="w"
      [style.height.px]="h"
      [class.dark]="dark"
    >
      <div class="bezel">
        <div class="notch">
          <span class="camera"></span>
          <span class="speaker"></span>
        </div>
        <div class="screen">
          <ng-content></ng-content>
        </div>
        <div class="buttons left"></div>
        <div class="buttons right"></div>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }
      .device {
        border-radius: 32px;
        padding: 10px;
        background: #111;
        box-shadow: 0 20px 50px rgba(0, 0, 0, 0.25),
          inset 0 0 0 2px rgba(255, 255, 255, 0.05);
        position: relative;
        margin: 0 auto;
      }
      .device.dark {
        background: #000;
      }
      .bezel {
        position: relative;
        height: 100%;
        border-radius: 24px;
        background: #000;
        overflow: hidden;
        box-shadow: inset 0 0 0 8px #000, inset 0 0 0 10px #222;
      }
      .screen {
        position: absolute;
        inset: 14px 8px 14px 8px; /* داخليات لإطار الشاشة */
        background: #fff;
        border-radius: 18px;
        overflow-x: hidden;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
      }
      /* نوتش بسيطة */
      .notch {
        position: absolute;
        top: 6px;
        left: 50%;
        transform: translateX(-50%);
        width: 180px;
        height: 28px;
        background: #000;
        border-bottom-left-radius: 14px;
        border-bottom-right-radius: 14px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        z-index: 2;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
      }
      .notch .camera {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: radial-gradient(circle at 30% 30%, #5cf, #024);
      }
      .notch .speaker {
        width: 44px;
        height: 6px;
        border-radius: 3px;
        background: #222;
      }
      /* أزرار جانبية تجميلية */
      .buttons.left,
      .buttons.right {
        position: absolute;
        top: 80px;
        width: 4px;
        height: 60px;
        background: #333;
        border-radius: 2px;
      }
      .buttons.left {
        left: -6px;
      }
      .buttons.right {
        right: -6px;
        height: 40px;
      }
    `,
  ],
})
export class DeviceFrameComponent {
  /** مقاس شاشة المحتوى الفعلي داخل الجهاز (بدون الحواف) */
  @Input() width: number | undefined;
  @Input() height: number | undefined;
  @Input() preset: 'iphone13' | 'small' | null = 'iphone13';
  @Input() dark = true;

  get w() {
    if (this.width) return this.width + 16; // padding + bezel
    if (this.preset === 'small') return 320 + 16;
    return 360 + 16; // Reduced from 390 to 360 for better fit
  }
  get h() {
    if (this.height) return this.height + 28; // padding + bezel
    if (this.preset === 'small') return 640 + 28;
    return 720 + 28; // Reduced from 844 to 720 for better fit
  }
}
