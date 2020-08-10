import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatasourceValueComponent } from './datasource-value.component';

describe('DatasourceValueComponent', () => {
  let component: DatasourceValueComponent;
  let fixture: ComponentFixture<DatasourceValueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DatasourceValueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatasourceValueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
