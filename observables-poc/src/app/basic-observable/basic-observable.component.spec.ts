import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BasicObservableComponent } from './basic-observable.component';

describe('BasicObservableComponent', () => {
  let component: BasicObservableComponent;
  let fixture: ComponentFixture<BasicObservableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BasicObservableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BasicObservableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
