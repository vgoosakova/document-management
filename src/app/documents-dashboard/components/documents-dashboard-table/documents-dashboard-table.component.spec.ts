import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DocumentsDashboardTableComponent} from './documents-dashboard-table.component';
import {MatSortModule} from '@angular/material/sort';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {provideRouter} from '@angular/router';
import {provideStore} from '@ngxs/store';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

describe('DocumentsDashboardTableComponent', () => {
  let component: DocumentsDashboardTableComponent;
  let fixture: ComponentFixture<DocumentsDashboardTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DocumentsDashboardTableComponent],
      imports: [MatTableModule, MatPaginatorModule, MatSortModule, BrowserAnimationsModule],
      providers: [provideRouter([]), provideStore([])]
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
