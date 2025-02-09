import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DocumentsDashboardFiltersComponent} from './documents-dashboard-filters.component';
import {ActivatedRoute} from '@angular/router';
import {Store} from '@ngxs/store';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatOptionModule} from '@angular/material/core';
import {ReactiveFormsModule} from '@angular/forms';
import {MatInputModule} from '@angular/material/input';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {DocumentStatus} from '../../state/documents-dashboard.model';
import {of} from 'rxjs';

const storeMock = {
  select: jasmine.createSpy().and.returnValue(of(null)),
  dispatch: jasmine.createSpy()
};

const activatedRouteMock = {
  queryParams: of({status: DocumentStatus.approved, creator: '1'})
};

const DEFAULT_FILTERS = {
  status: DocumentStatus.approved,
  creator: '1',
  page: 1,
};

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
      providers: [
        {provide: Store, useValue: storeMock},
        {provide: ActivatedRoute, useValue: activatedRouteMock}
      ]
    })
      .compileComponents();

    storeMock.dispatch.calls.reset();
    fixture = TestBed.createComponent(DocumentsDashboardFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize filters from query params', () => {
    expect(component.filters.status).toBe(DocumentStatus.approved);
    expect(component.filters.creator).toBe('1');
  });

  it('should emit filtersChanged on onFiltersChanged', () => {
    spyOn(component.filtersChanged, 'emit');
    component.filters.status = DocumentStatus.draft;
    component.onFiltersChanged();
    expect(component.filtersChanged.emit).toHaveBeenCalledWith({
      ...DEFAULT_FILTERS,
      status: DocumentStatus.draft,
    });
  });

  it('should clear creator filter and emit filtersChanged', () => {
    spyOn(component.filtersChanged, 'emit');
    component.clearCreator();
    expect(component.filters.creator).toBeUndefined();
    expect(component.filtersChanged.emit).toHaveBeenCalledWith({
      ...DEFAULT_FILTERS,
      creator: undefined,
    });
  });

  it('should handle undefined status or creator in filtersChanged event', () => {
    spyOn(component.filtersChanged, 'emit');
    component.filters.status = undefined;
    component.filters.creator = undefined;
    component.onFiltersChanged();
    expect(component.filtersChanged.emit).toHaveBeenCalledWith({
      status: undefined,
      creator: undefined,
      page: 1,
    });
  });
});
