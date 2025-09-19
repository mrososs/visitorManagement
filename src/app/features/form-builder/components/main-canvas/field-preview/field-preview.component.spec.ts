import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FieldPreviewComponent } from './field-preview.component';

describe('FieldPreviewComponent', () => {
  let component: FieldPreviewComponent;
  let fixture: ComponentFixture<FieldPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FieldPreviewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FieldPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
