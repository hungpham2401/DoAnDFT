import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportExcelTestComponent } from './import-excel-test.component';

describe('ImportExcelTestComponent', () => {
  let component: ImportExcelTestComponent;
  let fixture: ComponentFixture<ImportExcelTestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportExcelTestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportExcelTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
