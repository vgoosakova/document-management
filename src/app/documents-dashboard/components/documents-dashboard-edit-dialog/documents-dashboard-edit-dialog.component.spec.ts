import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentsDashboardEditDialogComponent } from './documents-dashboard-edit-dialog.component';

describe('DocumentsDashboardEditDialogComponent', () => {
  let component: DocumentsDashboardEditDialogComponent;
  let fixture: ComponentFixture<DocumentsDashboardEditDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocumentsDashboardEditDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocumentsDashboardEditDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
