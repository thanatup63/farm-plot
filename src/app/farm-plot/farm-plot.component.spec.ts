import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FarmPlotComponent } from './farm-plot.component';

describe('FarmPlotComponent', () => {
  let component: FarmPlotComponent;
  let fixture: ComponentFixture<FarmPlotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FarmPlotComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FarmPlotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
