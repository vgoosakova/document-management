import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentsDashboardFiltersComponent } from './documents-dashboard-filters.component';

describe('DocumentsDashboardRootComponent', () => {
  let component: DocumentsDashboardFiltersComponent;
  let fixture: ComponentFixture<DocumentsDashboardFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocumentsDashboardFiltersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocumentsDashboardFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
