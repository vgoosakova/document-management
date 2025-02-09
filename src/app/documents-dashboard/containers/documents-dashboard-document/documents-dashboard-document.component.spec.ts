import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DocumentsDashboardDocumentComponent} from './documents-dashboard-document.component';
import {Store} from '@ngxs/store';
import {ActivatedRoute, RouterModule} from '@angular/router';
import {MatIconModule} from '@angular/material/icon';
import {DocumentsDashboardState} from '../../state/documents-dashboard.state';
import {of} from 'rxjs';
import {LoadDocument} from '../../state/documents-dashboard.actions';
import PSPDFKit from 'pspdfkit';
import {ErrorHandlerService} from '../../../shared/services/error-handler.service';

const storeMock = {
  dispatch: jasmine.createSpy('dispatch'),
  select: jasmine.createSpy('select').and.callFake((selector) => {
    if (selector === DocumentsDashboardState.currentDocument) {
      return of({fileUrl: 'http://example.com/doc.pdf'});
    }
    return of(null);
  })
};

const routeMock = {snapshot: {paramMap: {get: jasmine.createSpy('get').and.returnValue('123')}}};
const errorHandlerMock = jasmine.createSpyObj('ErrorHandlerService', ['showErrorMessage']);

const mockInstance = jasmine.createSpyObj('Instance', ['unload']);

describe('DocumentsDashboardDocumentComponent', () => {
  let component: DocumentsDashboardDocumentComponent;
  let fixture: ComponentFixture<DocumentsDashboardDocumentComponent>;

  beforeEach(async () => {
    spyOn(PSPDFKit, 'load').and.returnValue(Promise.resolve(mockInstance));

    await TestBed.configureTestingModule({
      declarations: [DocumentsDashboardDocumentComponent],
      imports: [MatIconModule, RouterModule],
      providers: [
        {provide: Store, useValue: storeMock},
        {provide: ActivatedRoute, useValue: routeMock},
        {provide: ErrorHandlerService, useValue: errorHandlerMock}
      ]
    })
      .compileComponents();

    storeMock.dispatch.calls.reset();
    fixture = TestBed.createComponent(DocumentsDashboardDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    if (component.viewerContainer) {
      component.ngOnDestroy();
    }
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should dispatch LoadDocument action on init if documentId exists', () => {
    component.ngOnInit();
    expect(storeMock.dispatch).toHaveBeenCalledWith(new LoadDocument('123'));
  });

  it('should load PSPDFKit if document fileUrl is available', async () => {
    component.viewerContainer = {nativeElement: document.createElement('div')} as any;
    component.ngOnInit();
    await fixture.whenStable();

    expect(PSPDFKit.load).toHaveBeenCalledWith(
      jasmine.objectContaining({document: jasmine.stringContaining('doc.pdf')})
    );
  });

  it('should handle errors when loading PSPDFKit', async () => {
    (PSPDFKit.load as jasmine.Spy).and.returnValue(Promise.reject(new Error('Load error')));
    component.viewerContainer = {nativeElement: document.createElement('div')};
    await component['loadPSPDFKit']('http://example.com/doc.pdf');
    expect(errorHandlerMock.showErrorMessage).toHaveBeenCalledWith('Something went wrong...');
  });
});
