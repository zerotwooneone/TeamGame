import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpaceContentComponent } from './space-content.component';

describe('SpaceContentComponent', () => {
  let component: SpaceContentComponent;
  let fixture: ComponentFixture<SpaceContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpaceContentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpaceContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
