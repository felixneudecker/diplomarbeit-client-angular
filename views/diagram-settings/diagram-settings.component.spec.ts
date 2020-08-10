import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiagramSettingsComponent } from './diagram-settings.component';

describe('DiagramSettingsComponent', () => {
  let component: DiagramSettingsComponent;
  let fixture: ComponentFixture<DiagramSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiagramSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiagramSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
