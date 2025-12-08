import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KonvaCanvasBuilder } from './konva-canvas-builder';

describe('KonvaCanvasBuilder', () => {
  let component: KonvaCanvasBuilder;
  let fixture: ComponentFixture<KonvaCanvasBuilder>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KonvaCanvasBuilder]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KonvaCanvasBuilder);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
