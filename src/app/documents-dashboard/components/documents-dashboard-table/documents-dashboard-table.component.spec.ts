import {ComponentFixture, TestBed} from '@angular/core/testing';
import {DocumentsDashboardTableComponent} from './documents-dashboard-table.component';
import {MatSortModule, Sort} from '@angular/material/sort';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule, PageEvent} from '@angular/material/paginator';
import {provideRouter} from '@angular/router';
import {Store} from '@ngxs/store';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {of} from 'rxjs';
import {DocumentModel, DocumentStatus} from '../../state/documents-dashboard.model';
import {
  ChangeDocumentStatus,
  DeleteDocument,
  RevokeDocumentReview,
  SendDocumentToReview,
  UpdateDocument
} from '../../state/documents-dashboard.actions';
import {UserRole} from '../../../auth/state/auth.model';
import {MatDialog} from '@angular/material/dialog';

const storeMock = {
  select: jasmine.createSpy().and.returnValue(of(null)),
  dispatch: jasmine.createSpy()
};

const dialogMock = {
  open: jasmine.createSpy().and.returnValue({
    afterClosed: () => of(true)
  })
};

const createMockDocument = (status: DocumentStatus = DocumentStatus.draft): DocumentModel => ({
  id: '1',
  name: 'Test Document',
  status,
  creator: {
    id: '1',
    email: 'user2@example.com',
    fullName: 'User',
    role: UserRole.user,
  },
  fileUrl: 'http://example.com',
  updatedAt: '2025-02-07T12:20:38.006Z',
  createdAt: '2025-02-07T12:20:38.006Z',
});


describe('DocumentsDashboardTableComponent', () => {
  let component: DocumentsDashboardTableComponent;
  let fixture: ComponentFixture<DocumentsDashboardTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DocumentsDashboardTableComponent],
      imports: [MatTableModule, MatPaginatorModule, MatSortModule, BrowserAnimationsModule],
      providers: [
        provideRouter([]),
        {
          provide: Store,
          useValue: storeMock
        },
        {
          provide: MatDialog,
          useValue: dialogMock
        }]
    }).compileComponents();

    storeMock.dispatch.calls.reset();
    fixture = TestBed.createComponent(DocumentsDashboardTableComponent);
    component = fixture.componentInstance;
    component.documents = [];
    component.isReviewer = false;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize displayedColumns correctly', () => {
    component.isReviewer = true;
    component.ngOnInit();
    expect(component.displayedColumns).toEqual(['name', 'status', 'creator', 'updatedAt', 'actions']);

    component.isReviewer = false;
    component.ngOnInit();
    expect(component.displayedColumns).toEqual(['name', 'status', 'updatedAt', 'actions']);
  });

  it('should emit filtersChanged on updateFilters', () => {
    spyOn(component.filtersChanged, 'emit');
    component.updateFilters();
    expect(component.filtersChanged.emit).toHaveBeenCalledWith({
      page: component.pageIndex(),
      size: component.pageSize(),
      sort: component.sortField() ? `${component.sortField()},${component.sortDirection()}` : undefined
    });
  });

  it('should update pagination values on page change', () => {
    const event: PageEvent = {pageIndex: 1, pageSize: 10, length: 100};
    spyOn(component, 'updateFilters');
    component.onPageChange(event);
    expect(component.pageIndex()).toBe(event.pageIndex + 1);
    expect(component.pageSize()).toBe(event.pageSize);
    expect(component.updateFilters).toHaveBeenCalled();
  });

  it('should update sorting values on sort change', () => {
    const sortEvent: Sort = {active: 'name', direction: 'asc'};
    spyOn(component, 'updateFilters');
    component.onSortChange(sortEvent);
    expect(component.sortField()).toBe(sortEvent.active);
    expect(component.sortDirection()).toBe(sortEvent.direction);
    expect(component.updateFilters).toHaveBeenCalled();
  });

  it('should open confirmation dialog and dispatch revoke action', () => {
    const mockDocument = createMockDocument(DocumentStatus.readyForReview);
    component.revokeDocument(mockDocument);
    expect(dialogMock.open).toHaveBeenCalled();
    expect(storeMock.dispatch).toHaveBeenCalledWith(new RevokeDocumentReview(mockDocument.id));
  });

  it('should open confirmation dialog and dispatch send action', () => {
    const mockDocument = createMockDocument(DocumentStatus.draft);
    component.sendDocumentToReview(mockDocument);
    expect(dialogMock.open).toHaveBeenCalled();
    expect(storeMock.dispatch).toHaveBeenCalledWith(new SendDocumentToReview(mockDocument.id));
  });

  it('should open confirmation dialog and dispatch delete action', () => {
    const mockDocument = createMockDocument(DocumentStatus.draft);
    component.deleteDocument(mockDocument);
    expect(dialogMock.open).toHaveBeenCalled();
    expect(storeMock.dispatch).toHaveBeenCalledWith(new DeleteDocument(mockDocument.id));
  });

  it('should open confirmation dialog and dispatch edit action for user and change status for reviewer', () => {
    const mockDocument = createMockDocument(DocumentStatus.readyForReview);
    dialogMock.open.and.returnValue({
      afterClosed: () => of({status: DocumentStatus.approved})
    })
    component.isReviewer = true;
    component.editDocument(mockDocument);
    expect(dialogMock.open).toHaveBeenCalled();
    expect(storeMock.dispatch).toHaveBeenCalledWith(new ChangeDocumentStatus(mockDocument.id, DocumentStatus.approved));

    dialogMock.open.and.returnValue({
      afterClosed: () => of({name: 'Test Document Edit'})
    })
    component.isReviewer = false;
    component.editDocument(mockDocument);
    expect(dialogMock.open).toHaveBeenCalled();
    expect(storeMock.dispatch).toHaveBeenCalledWith(new UpdateDocument(mockDocument.id, 'Test Document Edit'));
  });
});
