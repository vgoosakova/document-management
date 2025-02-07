import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentsDashboardCreateDialogComponent } from './documents-dashboard-create-dialog.component';

describe('DocumentsDashboardCreateDialogComponent', () => {
  let component: DocumentsDashboardCreateDialogComponent;
  let fixture: ComponentFixture<DocumentsDashboardCreateDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocumentsDashboardCreateDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DocumentsDashboardCreateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
