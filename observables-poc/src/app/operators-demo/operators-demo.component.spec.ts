import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OperatorsDemoComponent } from './operators-demo.component';

describe('OperatorsDemoComponent', () => {
  let component: OperatorsDemoComponent;
  let fixture: ComponentFixture<OperatorsDemoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OperatorsDemoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OperatorsDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
