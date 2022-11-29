import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DevUtilComponent } from './dev-util.component';

describe('DevUtilComponent', () => {
  let component: DevUtilComponent;
  let fixture: ComponentFixture<DevUtilComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DevUtilComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DevUtilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
