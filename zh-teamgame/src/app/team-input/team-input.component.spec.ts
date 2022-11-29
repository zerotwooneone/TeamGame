import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamInputComponent } from './team-input.component';

describe('TeamInputComponent', () => {
  let component: TeamInputComponent;
  let fixture: ComponentFixture<TeamInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TeamInputComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeamInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
