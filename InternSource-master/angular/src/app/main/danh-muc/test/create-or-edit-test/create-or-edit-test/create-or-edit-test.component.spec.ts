import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateOrEditTestComponent } from './create-or-edit-test.component';

describe('CreateOrEditTestComponent', () => {
  let component: CreateOrEditTestComponent;
  let fixture: ComponentFixture<CreateOrEditTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreateOrEditTestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateOrEditTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
