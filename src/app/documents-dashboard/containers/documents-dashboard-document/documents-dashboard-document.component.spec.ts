import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentsDashboardDocumentComponent } from './documents-dashboard-document.component';

describe('DocumentsDashboardDocumentComponent', () => {
  let component: DocumentsDashboardDocumentComponent;
  let fixture: ComponentFixture<DocumentsDashboardDocumentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocumentsDashboardDocumentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocumentsDashboardDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
