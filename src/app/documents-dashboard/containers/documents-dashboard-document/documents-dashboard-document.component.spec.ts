import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DocumentsDashboardDocumentComponent} from './documents-dashboard-document.component';
import {provideStore} from '@ngxs/store';
import {provideRouter, RouterModule} from '@angular/router';
import {MatIconModule} from '@angular/material/icon';

describe('DocumentsDashboardDocumentComponent', () => {
  let component: DocumentsDashboardDocumentComponent;
  let fixture: ComponentFixture<DocumentsDashboardDocumentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DocumentsDashboardDocumentComponent],
      imports: [MatIconModule, RouterModule],
      providers: [provideStore([]), provideRouter([])]
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
