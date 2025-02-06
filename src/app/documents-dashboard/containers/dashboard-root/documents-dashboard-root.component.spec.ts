import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentsDashboardRootComponent } from './documents-dashboard-root.component';

describe('DocumentsDashboardRootComponent', () => {
  let component: DocumentsDashboardRootComponent;
  let fixture: ComponentFixture<DocumentsDashboardRootComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocumentsDashboardRootComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocumentsDashboardRootComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
