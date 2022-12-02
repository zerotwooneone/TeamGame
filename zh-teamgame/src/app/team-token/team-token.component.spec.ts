import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamTokenComponent } from './team-token.component';

describe('TeamTokenComponent', () => {
  let component: TeamTokenComponent;
  let fixture: ComponentFixture<TeamTokenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TeamTokenComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TeamTokenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
