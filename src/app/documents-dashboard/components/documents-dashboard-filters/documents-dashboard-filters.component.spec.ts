import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DocumentsDashboardFiltersComponent} from './documents-dashboard-filters.component';
import {provideRouter} from '@angular/router';
import {provideStore} from '@ngxs/store';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatOptionModule} from '@angular/material/core';
import {ReactiveFormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

describe('DocumentsDashboardFiltersComponent', () => {
  let component: DocumentsDashboardFiltersComponent;
  let fixture: ComponentFixture<DocumentsDashboardFiltersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DocumentsDashboardFiltersComponent],
      imports: [
        MatFormFieldModule,
        MatSelectModule,
        MatOptionModule,
        ReactiveFormsModule,
        MatInputModule,
        BrowserAnimationsModule,
      ],
      providers: [provideRouter([]), provideStore([])]
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
