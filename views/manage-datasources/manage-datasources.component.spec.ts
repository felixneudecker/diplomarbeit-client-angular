import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageDatasourcesComponent } from './manage-datasources.component';

describe('ManageDatasourcesComponent', () => {
  let component: ManageDatasourcesComponent;
  let fixture: ComponentFixture<ManageDatasourcesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageDatasourcesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageDatasourcesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
