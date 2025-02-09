import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DocumentsDashboardRootComponent} from './documents-dashboard-root.component';
import {ActivatedRoute, Router} from '@angular/router';
import {Store} from '@ngxs/store';
import {of} from 'rxjs';
import {MatDialog} from '@angular/material/dialog';
import {routerLinks} from '../../../core/enums';
import {CreateDocument} from '../../state/documents-dashboard.actions';


const storeMock = {
  select: jasmine.createSpy().and.returnValue(of(null)),
  dispatch: jasmine.createSpy()
};

const dialogMock = {
  open: jasmine.createSpy().and.returnValue({
    afterClosed: () => of(new FormData())
  })
};

const routerMock = {
  navigate: jasmine.createSpy(),
  url: '/' + routerLinks.dashboard
};

const activatedRouteMock = {
  queryParams: of({page: '1', size: '10'}),
  snapshot: {queryParams: {}}
};

describe('DocumentsDashboardRootComponent', () => {
  let component: DocumentsDashboardRootComponent;
  let fixture: ComponentFixture<DocumentsDashboardRootComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DocumentsDashboardRootComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: activatedRouteMock
        },
        {
          provide: Router,
          useValue: routerMock
        },
        {
          provide: Store,
          useValue: storeMock
        },
        {
          provide: MatDialog,
          useValue: dialogMock
        }],
    }).compileComponents();

    storeMock.dispatch.calls.reset();
    fixture = TestBed.createComponent(DocumentsDashboardRootComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch documents on init', () => {
    expect(storeMock.dispatch).toHaveBeenCalled();
  });

  it('should update query params on filter change', () => {
    component.onFiltersChanged({page: 2});
    expect(routerMock.navigate).toHaveBeenCalledWith([], {queryParams: jasmine.any(Object)});
  });

  it('should open add document dialog and dispatch action on close', () => {
    component.openAddDocumentDialog();
    expect(dialogMock.open).toHaveBeenCalled();
    expect(storeMock.dispatch).toHaveBeenCalledWith(new CreateDocument(new FormData()));
  });
});
