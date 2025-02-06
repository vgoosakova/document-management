import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentsDashboardTableComponent } from './documents-dashboard-table.component';

describe('DocumentsDashboardRootComponent', () => {
  let component: DocumentsDashboardTableComponent;
  let fixture: ComponentFixture<DocumentsDashboardTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocumentsDashboardTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocumentsDashboardTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
