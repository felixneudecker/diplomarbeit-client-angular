import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDiagramComponent } from './add-diagram.component';

describe('AddDiagramComponent', () => {
  let component: AddDiagramComponent;
  let fixture: ComponentFixture<AddDiagramComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddDiagramComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDiagramComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
